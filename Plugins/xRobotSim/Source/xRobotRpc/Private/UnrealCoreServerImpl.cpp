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
	
	auto InitRet = context.getResults().initReturn();
	auto InitOutParams = context.getResults().initOutParams(OutParams.size() - 1);

	auto Iter = OutParams.begin();
	if (Iter != OutParams.end())
	{
		auto ReturnTypeName = Iter->first;
		auto ReturnValue = Iter->second;
		InitRet.initClass().setTypeName(ReturnTypeName);

		if (ReturnTypeName == "bool")
		{
			bool* Result = static_cast<bool*>(ReturnValue);
			InitRet.setBoolValue(*Result);
		}
		else if (ReturnTypeName == "int")
		{
			int64_t* Result = static_cast<int64_t*>(ReturnValue);
			InitRet.setIntValue(*Result);
		}
		else if (ReturnTypeName == "uint")
		{
			uint64_t* Result = static_cast<uint64_t*>(ReturnValue);
			InitRet.setUintValue(*Result);
		}
		else if (ReturnTypeName == "double")
		{
			double* Result = static_cast<double*>(ReturnValue);
			InitRet.setFloatValue(*Result);
		}
		else if (ReturnTypeName == "str")
		{
			const char* Result = static_cast<const char*>(ReturnValue);
			InitRet.setStrValue(Result);
		}
		else if (ReturnTypeName == "object")
		{
			// auto Object =
			// 如果返回值是当前函数调用分配的对象，在端侧该怎么处理？
			// 例如：
			// 端侧有个对象类型UTestObject的一个函数声明： UMainActor* CreateOtherActor(FString Name);
			// 调用时 UMainActor* test = obj->CreateOtherActor("Hello");
			// 那这个test对象在端侧的内存地址如何传递到ue侧？

			// 解决思路：
			// 在then函数中传入端侧的test对象指针地址，并且将其存入ObjectHolder中
			// 
		}
		else if (ReturnTypeName == "void")
		{
			InitRet.initClass().setTypeName("void");
		}

		++Iter;
	}
	
	for (int i = 0; i < OutParams.size() && Iter != OutParams.end(); ++i, ++Iter)
	{
		auto OutParam = *Iter;
		auto TypeName = OutParam.first;
		auto Value = OutParam.second;

		InitOutParams[i].initClass().setTypeName(TypeName);

		if (TypeName == "bool")
		{
			bool* Result = static_cast<bool*>(Value);
			InitOutParams[i].setBoolValue(*Result);
		}
		else if (TypeName == "int")
		{
			int64_t* Result = static_cast<int64_t*>(Value);
			InitOutParams[i].setIntValue(*Result);
		}
		else if (TypeName == "uint")
		{
			uint64_t* Result = static_cast<uint64_t*>(Value);
			InitOutParams[i].setUintValue(*Result);
		}
		else if (TypeName == "double")
		{
			double* Result = static_cast<double*>(Value);
			InitOutParams[i].setFloatValue(*Result);
		}
		else if (TypeName == "str")
		{
			const char* Result = static_cast<const char*>(Value);
			InitOutParams[i].setStrValue(Result);
		}
		else if (TypeName == "object")
		{
			// find outer object from ObjectHolder
			auto OutObj = InitOutParams[i].initObject();

			UObject* ResultPtr = static_cast<UObject*>(Value);
			void* ObjPtr = FObjectHolder::Get().GetGrpcObject(ResultPtr);
			OutObj.setAddress(reinterpret_cast<uint64_t>(ObjPtr));
		}
	}
	
	return kj::READY_NOW;
}

kj::Promise<void> FUnrealCoreServerImpl::callStaticFunction(CallStaticFunctionContext context)
{
	return kj::READY_NOW;
}

kj::Promise<void> FUnrealCoreServerImpl::setProperty(SetPropertyContext context)
{
	
	return kj::READY_NOW;
}

kj::Promise<void> FUnrealCoreServerImpl::getProperty(GetPropertyContext context)
{
	return kj::READY_NOW;
}

kj::Promise<void> FUnrealCoreServerImpl::findClass(FindClassContext context)
{
	return kj::READY_NOW;
}

kj::Promise<void> FUnrealCoreServerImpl::loadClass(LoadClassContext context)
{
	return kj::READY_NOW;
}

kj::Promise<void> FUnrealCoreServerImpl::bindDelegate(BindDelegateContext context)
{
	return kj::READY_NOW;
}

kj::Promise<void> FUnrealCoreServerImpl::unbindDelegate(UnbindDelegateContext context)
{
	return kj::READY_NOW;
}

kj::Promise<void> FUnrealCoreServerImpl::addMultiDelegate(AddMultiDelegateContext context)
{
	return kj::READY_NOW;
}

kj::Promise<void> FUnrealCoreServerImpl::removeMultiDelegate(RemoveMultiDelegateContext context)
{
	return kj::READY_NOW;
}

kj::Promise<void> FUnrealCoreServerImpl::registerOverrideClass(RegisterOverrideClassContext context)
{
	return kj::READY_NOW;
}

kj::Promise<void> FUnrealCoreServerImpl::unregisterOverrideClass(UnregisterOverrideClassContext context)
{
	return kj::READY_NOW;
}

kj::Promise<void> FUnrealCoreServerImpl::staticClass(StaticClassContext context)
{
	return kj::READY_NOW;
}

