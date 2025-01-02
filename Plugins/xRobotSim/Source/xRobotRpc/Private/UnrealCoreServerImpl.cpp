#include "UnrealCoreServerImpl.h"

#include "CoreRpcUtils.h"
#include "ObjectHolder.h"

kj::Promise<void> FUnrealCoreServerImpl::newObject(NewObjectContext context)
{
	auto AllocClass = context.getParams().getClass();
	auto Outer = context.getParams().getOuter();
	auto NewObjName = context.getParams().getObjName();
	auto Flags = context.getParams().getFlags();
	
	auto ResponseObj = context.getResults().initObject();
	
	FString StrClassName = UTF8_TO_TCHAR(AllocClass.getTypeName().cStr());
	void* ClientHolder = reinterpret_cast<void*>(Outer.getAddress());

	// TODO: check address
	
	UObject* Obj = FObjectHolder::Get().GetUObject(ClientHolder);

	// TODO: handle create object failure
	if (!Obj)
	{
		FStructTypeContainer* TypeContainer = FCoreUtils::LoadUEType(StrClassName);
		Obj = TypeContainer->New(StrClassName, Flags);
		FObjectHolder::Get().RegisterToRetainer(ClientHolder, Obj);
	}

	ResponseObj.setName(NewObjName.cStr());
	ResponseObj.setAddress(reinterpret_cast<uint64_t>(Obj));
	
	return kj::READY_NOW;
}

kj::Promise<void> FUnrealCoreServerImpl::destroyObject(DestroyObjectContext context)
{
	auto Outer = context.getParams().getOuter();
	auto PointerAddr = Outer.getAddress();
	void* ClientHolder = reinterpret_cast<void*>(PointerAddr);

	// TODO: check address

	if (!FObjectHolder::Get().HasObject(ClientHolder))
	{
		context.getResults().setResult(false);
	}
	else
	{
		FObjectHolder::Get().RemoveFromRetainer(ClientHolder);
		context.getResults().setResult(true);
	}
	
	return kj::READY_NOW;
}

kj::Promise<void> FUnrealCoreServerImpl::callFunction(CallFunctionContext context)
{
	auto Outer = context.getParams().getOuter();
	auto CallObject = context.getParams().getCallObject();
	auto FuncName = context.getParams().getFuncName().cStr();
	auto Class = context.getParams().getClass();
	auto FuncParams = context.getParams().getParams();

	void* ClientHolder = reinterpret_cast<void*>(Outer.getAddress());
	if (!FObjectHolder::Get().HasObject(ClientHolder))
	{
		// throw exception to client
		return kj::Promise<void>(kj::Exception(kj::Exception::Type::FAILED,
				__FILE__, __LINE__, kj::str("Can not find the object in system's object holder, run newObject at first.")));
	}

	UObject* FoundObject = FObjectHolder::Get().GetUObject(ClientHolder);
	UObject* PassedInObject = reinterpret_cast<UObject*>(CallObject.getAddress());

	if (FoundObject != PassedInObject)
	{
		char buff[128];
		sprintf_s(buff, sizeof(buff),
			"Call function %s failed, the object found in object holder %p is not equal to passed by caller %p",
			FuncName, FoundObject, PassedInObject);
		
		return kj::Promise<void>(kj::Exception(kj::Exception::Type::FAILED,
				__FILE__, __LINE__, kj::str(buff)));
	}

	FString ClassName = UTF8_TO_TCHAR(Class.getTypeName().cStr());
	auto* TypeContainer = FCoreUtils::GetUEType(ClassName);
	if (!TypeContainer)
	{
		return kj::Promise<void>(kj::Exception(kj::Exception::Type::FAILED,
		__FILE__, __LINE__, kj::str("Can not find class type, must call newObject to alloc a object.")));
	}

	auto FuncWrapper = TypeContainer->FindFunction(UTF8_TO_TCHAR(FuncName));

	// TODO: use any at beta it maybe has some performance issue
	std::vector<void*> PassToParams;
	for (const auto& Param : FuncParams)
	{
		const FString ParamClassName = UTF8_TO_TCHAR(Param.getClass().getTypeName().cStr());
		if (Param.isBoolValue())
		{
			auto Val = new bool(Param.getBoolValue());
			PassToParams.push_back(Val);
		}
		else if (Param.isIntValue())
		{
			auto Val = new int64(Param.getIntValue());
			PassToParams.push_back(Val);
		}
		else if (Param.isUintValue())
		{
			auto Val = new uint64(Param.getUintValue());
			PassToParams.push_back(Val);
		}
		else if (Param.getFloatValue())
		{
			auto Val = new double(Param.getFloatValue());
			PassToParams.push_back(Val);
		}
		else if (Param.isStrValue())
		{
			FString* Val = new FString(UTF8_TO_TCHAR(Param.getStrValue().cStr()));
			PassToParams.push_back(Val);
		}
		else if (Param.isObject())
		{
			auto Val = Param.getObject();
			FString Name = UTF8_TO_TCHAR(Val.getName().cStr());
			void* Pointer = reinterpret_cast<void*>(Val.getAddress());
			// TODO: support cpp native type
			UObject* ObjPointer = FObjectHolder::Get().GetUObject(Pointer);
			PassToParams.push_back(ObjPointer);
		}
		else
		{
			// not support type
		}
	}

	std::map<std::string /* type name */, void*> OutParams;
	FuncWrapper->Call(FoundObject, PassToParams, OutParams);
	
	auto InitRes = context.initResults().initResult(OutParams.size());

	auto Iter = OutParams.begin();
	for (int i = 0; i < OutParams.size() && Iter != OutParams.end(); ++i, ++Iter)
	{
		auto OutParam = *Iter;
		auto TypeName = OutParam.first;
		auto Value = OutParam.second;

		if (TypeName == "bool")
		{
			bool* Result = static_cast<bool*>(Value);
			InitRes[i].setBoolValue(*Result);
		}
		else if (TypeName == "int")
		{
			int64_t* Result = static_cast<int64_t*>(Value);
			InitRes[i].setIntValue(*Result);
		}
		else if (TypeName == "uint")
		{
			uint64_t* Result = static_cast<uint64_t*>(Value);
			InitRes[i].setUintValue(*Result);
		}
		else if (TypeName == "double")
		{
			double* Result = static_cast<double*>(Value);
			InitRes[i].setFloatValue(*Result);
		}
		else if (TypeName == "str")
		{
			const char* Result = static_cast<const char*>(Value);
			InitRes[i].setStrValue(Result);
		}
		else if (TypeName == "object")
		{
			// auto Object =
			// 如果返回值是当前函数调用分配的对象，在端侧该怎么处理？
			// 例如：
			// 端侧有个对象类型UTestObject的一个函数声明： UMainActor* CreateOtherActor(FString Name);
			// 调用时 UMainActor* test = obj->CreateOtherActor("Hello");
			// 那这个test对象在端侧的内存地址如何传递到ue侧？
			 
		}
	}
	
	return kj::READY_NOW;
}

