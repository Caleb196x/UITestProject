#include "UnrealCoreServerImpl.h"

#include "CoreRpcUtils.h"
#include "ObjectHolder.h"

#define CHECK_RESULT_AND_RETURN(Result) \
	context = Result.Context; \
	if (!Result.Info.bIsSuccess) \
	{ \
		return kj::Promise<void>(kj::Exception(kj::Exception::Type::FAILED, \
			Result.Info.FileCStr(), Result.Info.Line, kj::str(Result.Info.MessageCStr()))); \
	} \
	else \
	{ \
		return kj::READY_NOW; \
	} \

kj::Promise<void> FUnrealCoreServerImpl::newObject(NewObjectContext context)
{
	const auto Result = GameThreadDispatcher<NewObjectContext>::EnqueueToGameThreadExec(NewObjectInternal, context);

	CHECK_RESULT_AND_RETURN(Result)
}

kj::Promise<void> FUnrealCoreServerImpl::destroyObject(DestroyObjectContext context)
{
	const auto Result = GameThreadDispatcher<DestroyObjectContext>::EnqueueToGameThreadExec(DestroyObjectInternal, context);
	CHECK_RESULT_AND_RETURN(Result)
}

kj::Promise<void> FUnrealCoreServerImpl::callFunction(CallFunctionContext context)
{
	const auto Result = GameThreadDispatcher<CallFunctionContext>::EnqueueToGameThreadExec(CallFunctionInternal, context);
	CHECK_RESULT_AND_RETURN(Result)
}

kj::Promise<void> FUnrealCoreServerImpl::callStaticFunction(CallStaticFunctionContext context)
{
	const auto Result = GameThreadDispatcher<CallStaticFunctionContext>::EnqueueToGameThreadExec(CallStaticFunctionInternal, context);
	CHECK_RESULT_AND_RETURN(Result)
}

kj::Promise<void> FUnrealCoreServerImpl::setProperty(SetPropertyContext context)
{
	const auto Result = GameThreadDispatcher<SetPropertyContext>::EnqueueToGameThreadExec(SetPropertyInternal, context);
	CHECK_RESULT_AND_RETURN(Result)
}

kj::Promise<void> FUnrealCoreServerImpl::getProperty(GetPropertyContext context)
{
	const auto Result = GameThreadDispatcher<GetPropertyContext>::EnqueueToGameThreadExec(GetPropertyInternal, context);
	CHECK_RESULT_AND_RETURN(Result)
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

struct AutoMemoryFreer
{
	void AddPtr(const FString& TypeName, void* Ptr)
	{
		PtrRetainer.Add(TypeName, Ptr);
	}

	TMap<FString/*type name*/, void*> PtrRetainer;

	~AutoMemoryFreer()
	{
		for (const auto Pair : PtrRetainer)
		{
			FString TypeName = Pair.Key;
			void* Ptr = Pair.Value;
			if (TypeName == "int" || TypeName == "enum")
			{
				const int64* DataPtr = static_cast<int64*>(Ptr);
				delete DataPtr;
				DataPtr = nullptr;
			}
			else if (TypeName == "uint")
			{
				const uint64* DataPtr = static_cast<uint64*>(Ptr);
				delete DataPtr;
				DataPtr = nullptr;
			}
			else if (TypeName == "float")
			{
				const double* DataPtr = static_cast<double*>(Ptr);
				delete DataPtr;
				DataPtr = nullptr;
			}
			else if (TypeName == "bool")
			{
				const bool* DataPtr = static_cast<bool*>(Ptr);
				delete DataPtr;
				DataPtr = nullptr;
			}
			else if (TypeName == "str")
			{
				const FString* DataPtr = static_cast<FString*>(Ptr);
				delete DataPtr;
				DataPtr = nullptr;
			}
		}
	}
};

ErrorInfo FUnrealCoreServerImpl::NewObjectInternal(NewObjectContext context)
{
	const auto AllocClass = context.getParams().getClass();
	const auto Outer = context.getParams().getOuter();
	const auto NewObjName = context.getParams().getObjName();
	const auto Flags = context.getParams().getFlags();
	auto ConstructArgs = context.getParams().getConstructArgs();
	
	auto ResponseObj = context.getResults().initObject();
	
	const FString ClassName = UTF8_TO_TCHAR(AllocClass.getTypeName().cStr());
	void* ClientHolder = reinterpret_cast<void*>(Outer.getAddress());

	AutoMemoryFreer AutoFreer;

	// TODO: check address
	
	FObjectHolder::FUEObject* Obj = FObjectHolder::Get().GetUObject(ClientHolder);

	// TODO: handle create object failure
	if (!Obj)
	{
		FStructTypeContainer* TypeContainer = FCoreUtils::LoadUEStructType(ClassName);
		if (!TypeContainer)
		{
			return ErrorInfo(__FILE__, __LINE__,
				FString::Printf(TEXT("Can not load type container for %s"), *ClassName));
		}

		// todo: pass to construct arguments
		TArray<void*> Args;
		for (const auto& Arg : ConstructArgs)
		{
			switch (Arg.which())
			{
				case UnrealCore::Argument::INT_VALUE:
				{
					int64* DataPtr = new int64(Arg.getIntValue());
					AutoFreer.AddPtr("int", DataPtr);
					Args.Add(DataPtr);
					break;
				}
				case UnrealCore::Argument::STR_VALUE:
				{
					FString* DataPtr = new FString(UTF8_TO_TCHAR(Arg.getStrValue().cStr()));
					AutoFreer.AddPtr("str", DataPtr);
					Args.Add(DataPtr);
					break;
				}
				case UnrealCore::Argument::UINT_VALUE:
				{
					uint64* DataPtr = new uint64(Arg.getUintValue());
					AutoFreer.AddPtr("uint", DataPtr);
					Args.Add(DataPtr);
					break;
				}
				case UnrealCore::Argument::FLOAT_VALUE:
				{
					double* DataPtr = new double(Arg.getFloatValue());
					AutoFreer.AddPtr("float", DataPtr);
					Args.Add(DataPtr);
					break;
				}
				case UnrealCore::Argument::BOOL_VALUE:
				{
					bool* DataPtr = new bool(Arg.getBoolValue());
					AutoFreer.AddPtr("bool", DataPtr);
					Args.Add(DataPtr);
					break;
				}
				case UnrealCore::Argument::OBJECT:
				{
					FString TypeName = UTF8_TO_TCHAR(Arg.getClass().getTypeName().cStr());
					void* Pointer = reinterpret_cast<void*>(Arg.getObject().getAddress());
					UE_LOG(LogUnrealPython, Display, TEXT("NewObject for class %s and pass by object type %s"), *ClassName, *TypeName)
					// TODO: support cpp native type
					FObjectHolder::FUEObject* ObjPointer = FObjectHolder::Get().GetUObject(Pointer);
					Args.Add(ObjPointer->Ptr);
					break;
				}
				case UnrealCore::Argument::ENUM_VALUE:
				{
					int64* EnumPtr = new int64(Arg.getEnumValue());
					AutoFreer.AddPtr("enum", EnumPtr);
					Args.Add(EnumPtr);
					break;
				}
				default:
					break;
			}
		}
		void* NewObjPtr = TypeContainer->New(ClassName, Flags, Args);
		
		Obj = FObjectHolder::Get().RegisterToRetainer(ClientHolder, NewObjPtr, TypeContainer->GetMetaTypeName(), ClassName);
	}

	ResponseObj.setName(NewObjName.cStr());
	ResponseObj.setAddress(reinterpret_cast<uint64_t>(Obj->Ptr));

	return true;
}

ErrorInfo FUnrealCoreServerImpl::DestroyObjectInternal(DestroyObjectContext context)
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

	return true;
}

ErrorInfo FUnrealCoreServerImpl::SetPropertyInternal(SetPropertyContext context)
{
	const auto OwnerClass = context.getParams().getClass();
	const auto OwnerObject = context.getParams().getOwner();
	const auto Property = context.getParams().getProperty();
	const FString PropertyName = UTF8_TO_TCHAR(Property.getName().cStr());
	FString PropertyTypeName = UTF8_TO_TCHAR(Property.getClass().getTypeName().cStr());
	
	void* ClientHolder = reinterpret_cast<void*>(OwnerObject.getAddress());
	
	FObjectHolder::FUEObject* Obj = FObjectHolder::Get().GetUObject(ClientHolder);
	if (!Obj)
	{
		return ErrorInfo(__FILE__, __LINE__, 
			FString::Printf(TEXT("Set property %s failed, can not find ue object for client object %p"),
				*PropertyName, ClientHolder));
	}

	const FString OwnerClassTypeName = UTF8_TO_TCHAR(OwnerClass.getTypeName().cStr());
	FStructTypeContainer* TypeContainer = FCoreUtils::LoadUEStructType(OwnerClassTypeName);
	if (!TypeContainer)
	{
		return ErrorInfo(__FILE__, __LINE__,
			FString::Printf(TEXT("Can not load type container for %s"), *OwnerClassTypeName));
	}
		
	if (const std::shared_ptr<FPropertyWrapper> PropertyWrapper = TypeContainer->FindProperty(PropertyName))
	{
		UObject* ObjectPtr = static_cast<UObject*>(Obj->Ptr);

		if (FCoreUtils::IsReleasePtr(ObjectPtr))
		{
			return ErrorInfo(__FILE__, __LINE__,
				FString::Printf(TEXT("Set property %s failed, object has bee released"),
					*PropertyName));
		}

		void* PropertyValue = nullptr;
		switch (Property.which())
		{
			case UnrealCore::Property::INT_VALUE:
				PropertyValue = new int64(Property.getIntValue());
				break;
			case UnrealCore::Property::STR_VALUE:
				PropertyValue = new FString(UTF8_TO_TCHAR(Property.getStrValue().cStr()));
				break;
			case UnrealCore::Property::UINT_VALUE:
				PropertyValue = new uint64(Property.getUintValue());
				break;
			case UnrealCore::Property::FLOAT_VALUE:
				PropertyValue = new double(Property.getFloatValue());
				break;
			case UnrealCore::Property::BOOL_VALUE:
				PropertyValue = new bool(Property.getBoolValue());
				break;
			case UnrealCore::Property::OBJECT:
				PropertyValue = reinterpret_cast<void*>(Property.getObject().getAddress());
				break;
			case UnrealCore::Property::ENUM_VALUE:
				PropertyValue = new int64(Property.getEnumValue());
				break;
			default:
				break;
		}
		PropertyWrapper->Setter(ObjectPtr, PropertyValue);
	}
	else
	{
		return ErrorInfo(__FILE__, __LINE__,
			FString::Printf(TEXT("Set property %s failed, can not find property %s in class %s"),
				*PropertyName, *PropertyTypeName, *OwnerClassTypeName));
	}
	
	return true;
}

ErrorInfo FUnrealCoreServerImpl::GetPropertyInternal(GetPropertyContext context)
{
	const auto OwnerClass = context.getParams().getClass();
	const auto OwnerObject = context.getParams().getOwner();
	const FString PropertyName = UTF8_TO_TCHAR(context.getParams().getPropertyName().cStr());
	void* ClientHolder = reinterpret_cast<void*>(OwnerObject.getAddress());
	
	FObjectHolder::FUEObject* Obj = FObjectHolder::Get().GetUObject(ClientHolder);
	if (!Obj)
	{
		return ErrorInfo(__FILE__, __LINE__, 
			FString::Printf(TEXT("Set property %s failed, can not find ue object for client object %p"),
				*PropertyName, ClientHolder));
	}

	const FString OwnerClassTypeName = UTF8_TO_TCHAR(OwnerClass.getTypeName().cStr());
	FStructTypeContainer* TypeContainer = FCoreUtils::LoadUEStructType(OwnerClassTypeName);
	if (!TypeContainer)
	{
		return ErrorInfo(__FILE__, __LINE__,
			FString::Printf(TEXT("Can not load type container for %s"), *OwnerClassTypeName));
	}

	AutoMemoryFreer Freer;

	if (const std::shared_ptr<FPropertyWrapper> PropertyWrapper = TypeContainer->FindProperty(PropertyName))
	{
		auto Result = context.getResults().initProperty();
		const FString UePropertyTypeName = PropertyWrapper->GetCppType();
		Result.initClass().setTypeName(TCHAR_TO_UTF8(*UePropertyTypeName));
		Result.setName(context.getParams().getPropertyName());
		std::string RpcTypeName = FCoreUtils::ConvertUeTypeNameToRpcTypeName(UePropertyTypeName);

		UObject* ObjectPtr = static_cast<UObject*>(Obj->Ptr);
		if (FCoreUtils::IsReleasePtr(ObjectPtr))
		{
			return ErrorInfo(__FILE__, __LINE__,
				FString::Printf(TEXT("Get property %s failed, object has bee released"),
					*PropertyName));
		}
		
		void* PropertyValue = PropertyWrapper->Getter(ObjectPtr);

		if (UEnum* Enum = Cast<UEnum>(PropertyWrapper->GetProperty()))
		{
			RpcTypeName = "enum";
		}

		if (RpcTypeName == "int")
		{
			const int64* Value = static_cast<int64*>(PropertyValue);
			Result.setIntValue(*Value);
			Freer.AddPtr("int", PropertyValue);
		}
		else if (RpcTypeName == "uint")
		{
			const uint64* Value = static_cast<uint64*>(PropertyValue);
			Result.setUintValue(*Value);
			Freer.AddPtr("uint", PropertyValue);
		}
		else if (RpcTypeName == "bool")
		{
			const bool* Value = static_cast<bool*>(PropertyValue);
			Result.setBoolValue(*Value);
			Freer.AddPtr("bool", PropertyValue);
		}
		else if (RpcTypeName == "float")
		{
			const double* Value = static_cast<double*>(PropertyValue);
			Result.setFloatValue(*Value);
			Freer.AddPtr("float", PropertyValue);
		}
		else if (RpcTypeName == "str")
		{
			const FString* Value = static_cast<FString*>(PropertyValue);
			std::string StdStr = TCHAR_TO_UTF8(*(*Value));
			Result.setStrValue(StdStr);
			Freer.AddPtr("str", PropertyValue);
		}
		else if (RpcTypeName == "object")
		{
			auto Object = Result.initObject();
			void* RpcObject = FObjectHolder::Get().GetGrpcObject(PropertyValue);
			if (!RpcObject)
			{
				return ErrorInfo(__FILE__, __LINE__,
					FString::Printf(TEXT("Get property %s failed, can not find rpc object for ue object %p"),
						*PropertyName, PropertyValue));
			}
			
			uint64 Addr = reinterpret_cast<uint64>(RpcObject);
			Object.setAddress(Addr);
		}
		else if (RpcTypeName == "enum")
		{
			const int64* Value = static_cast<int64*>(PropertyValue);
			Result.setEnumValue(*Value);
			Freer.AddPtr("enum", PropertyValue);
		}
	}
	else
	{
		return ErrorInfo(__FILE__, __LINE__,
			FString::Printf(TEXT("Can not find property %s in class %s"),
				*PropertyName, *OwnerClassTypeName));
	}
	
	return true;
}

ErrorInfo FUnrealCoreServerImpl::CallFunctionInternal(CallFunctionContext context)
{
	return CallFunctionCommon(&context, nullptr, false);
}

ErrorInfo FUnrealCoreServerImpl::CallStaticFunctionInternal(CallStaticFunctionContext context)
{
	return CallFunctionCommon(nullptr, &context, true);
}

ErrorInfo FUnrealCoreServerImpl::CallFunctionCommon(CallFunctionContext* ObjectCallContext, CallStaticFunctionContext* StaticCallContext, bool bIsStaticFunc)
{
	FString ClassName;
	FString FunctionName;
	capnp::List<UnrealCore::Argument>::Reader InFuncParam;
	FObjectHolder::FUEObject* FoundObject = nullptr;
	
	if (!bIsStaticFunc)
	{
		auto Outer = ObjectCallContext->getParams().getOuter();
		auto CallObject = ObjectCallContext->getParams().getCallObject();
		auto InFuncName = ObjectCallContext->getParams().getFuncName().cStr();
		auto Class = ObjectCallContext->getParams().getClass();
		InFuncParam = ObjectCallContext->getParams().getParams();

		void* ClientHolder = reinterpret_cast<void*>(Outer.getAddress());
		if (!FObjectHolder::Get().HasObject(ClientHolder))
		{
			// throw exception to client
			return ErrorInfo(__FILE__, __LINE__,
				"Can not find the object in system's object holder, run newObject at first.");
		}

		FoundObject = FObjectHolder::Get().GetUObject(ClientHolder);
		UObject* PassedInObject = reinterpret_cast<UObject*>(CallObject.getAddress());
		FunctionName = UTF8_TO_TCHAR(InFuncName);
		
		if (FoundObject->Ptr != PassedInObject)
		{
			return ErrorInfo(__FILE__, __LINE__,
				FString::Printf(TEXT("Call function %s failed, the object found in object holder %p is not equal to passed by caller %p"),
					*FunctionName, FoundObject, PassedInObject));
		}

		ClassName = UTF8_TO_TCHAR(Class.getTypeName().cStr());
	
		if (!ClassName.Equals(FoundObject->ClassName))
		{
			return ErrorInfo(__FILE__, __LINE__,
				FString::Printf(TEXT("Class name passed from client: %s is not equal to class name saved in object holder: %s"),
					*ClassName, *FoundObject->ClassName));
		}
	}
	else
	{
		auto InFuncName = StaticCallContext->getParams().getFuncName().cStr();
		auto Class = StaticCallContext->getParams().getClass();
		InFuncParam = StaticCallContext->getParams().getParams();
		ClassName = UTF8_TO_TCHAR(Class.getTypeName().cStr());
		FunctionName = UTF8_TO_TCHAR(InFuncName);
	}

	auto* TypeContainer = FCoreUtils::GetUEStructType(ClassName);
	if (!TypeContainer)
	{
		return ErrorInfo(__FILE__, __LINE__,
			FString::Printf(TEXT("Can not find type container for class %s"), *ClassName));
	}
	
	auto FuncWrapper = TypeContainer->FindFunction(FunctionName);

	AutoMemoryFreer AutoFreer;

	// TODO: use any at beta it maybe has some performance issue
	std::vector<void*> PassToParams;
	for (const auto& Param : InFuncParam)
	{
		const FString ParamClassName = UTF8_TO_TCHAR(Param.getClass().getTypeName().cStr());
		switch (Param.which())
		{
			case UnrealCore::Argument::INT_VALUE:
			{
				int64* DataPtr = new int64(Param.getIntValue());
				AutoFreer.AddPtr("int", DataPtr);
				PassToParams.push_back(DataPtr);
				break;
			}
			case UnrealCore::Argument::STR_VALUE:
			{
				FString* DataPtr = new FString(UTF8_TO_TCHAR(Param.getStrValue().cStr()));
				AutoFreer.AddPtr("str", DataPtr);
				PassToParams.push_back(DataPtr);
				break;
			}
			case UnrealCore::Argument::UINT_VALUE:
			{
				uint64* DataPtr = new uint64(Param.getUintValue());
				AutoFreer.AddPtr("uint", DataPtr);
				PassToParams.push_back(DataPtr);
				break;
			}
			case UnrealCore::Argument::FLOAT_VALUE:
			{
				double* DataPtr = new double(Param.getFloatValue());
				AutoFreer.AddPtr("float", DataPtr);
				PassToParams.push_back(DataPtr);
				break;
			}
			case UnrealCore::Argument::BOOL_VALUE:
			{
				bool* DataPtr = new bool(Param.getBoolValue());
				AutoFreer.AddPtr("bool", DataPtr);
				PassToParams.push_back(DataPtr);
				break;
			}
			case UnrealCore::Argument::OBJECT:
			{
				FString TypeName = UTF8_TO_TCHAR(Param.getClass().getTypeName().cStr());
				void* Pointer = reinterpret_cast<void*>(Param.getObject().getAddress());
				UE_LOG(LogUnrealPython, Display, TEXT("CallFunction for class %s and pass by object type %s"), *ClassName, *TypeName)
				// TODO: support cpp native type
				FObjectHolder::FUEObject* ObjPointer = FObjectHolder::Get().GetUObject(Pointer);
				PassToParams.push_back(ObjPointer->Ptr);
				break;
			}
			case UnrealCore::Argument::ENUM_VALUE:
			{
				int64* EnumPtr = new int64(Param.getEnumValue());
				AutoFreer.AddPtr("enum", EnumPtr);
				PassToParams.push_back(EnumPtr);
				break;
			}
			default:
				break;
		}
	}

	std::vector<std::pair<std::string /* type name */, void*>> OutParams;
	UnrealCore::Argument::Builder* FuncRet = nullptr;
	capnp::List<UnrealCore::Argument>::Builder InitOutParams;
	
	if (!bIsStaticFunc)
	{
		if (FoundObject && FoundObject->MetaTypeName.Equals("UClass"))
		{
			UObject* ObjPtr = static_cast<UObject*>(FoundObject->Ptr);
			FuncWrapper->Call(ObjPtr, PassToParams, OutParams);
		}
		else
		{
			return ErrorInfo(__FILE__, __LINE__,
				FString::Printf(TEXT("Can not call function  %s on %s, only call function on the UClass"),
					*FunctionName, *FoundObject->ClassName));
		}

		auto Ret = ObjectCallContext->getResults().initReturn();
		FuncRet = &Ret;
		
		InitOutParams = ObjectCallContext->getResults().initOutParams(OutParams.size() - 1);
	}
	else
	{
		FuncWrapper->CallStatic(PassToParams, OutParams);
		auto Ret = StaticCallContext->getResults().initReturn();
		FuncRet = &Ret;

		InitOutParams = StaticCallContext->getResults().initOutParams(OutParams.size() - 1);
	}
	
	auto Iter = OutParams.begin();
	if (Iter != OutParams.end())
	{
		auto ReturnTypeName = Iter->first;
		auto ReturnValue = Iter->second; 
		FuncRet->initClass().setTypeName(ReturnTypeName);

		if (ReturnTypeName == "bool")
		{
			bool* Result = static_cast<bool*>(ReturnValue);
			FuncRet->setBoolValue(*Result);
		}
		else if (ReturnTypeName == "int")
		{
			int64_t* Result = static_cast<int64_t*>(ReturnValue);
			FuncRet->setIntValue(*Result);
		}
		else if (ReturnTypeName == "uint")
		{
			uint64_t* Result = static_cast<uint64_t*>(ReturnValue);
			FuncRet->setUintValue(*Result);
		}
		else if (ReturnTypeName == "double")
		{
			double* Result = static_cast<double*>(ReturnValue);
			FuncRet->setFloatValue(*Result);
		}
		else if (ReturnTypeName == "str")
		{
			const char* Result = static_cast<const char*>(ReturnValue);
			FuncRet->setStrValue(Result);
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
			FuncRet->initClass().setTypeName("void");
		}
		else if (ReturnTypeName == "enum")
		{
			int64_t* Result = static_cast<int64_t*>(ReturnValue);
			FuncRet->setEnumValue(*Result);
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

	return true;
}

ErrorInfo FUnrealCoreServerImpl::FindClassInternal(FindClassContext context)
{
	return true;
}

ErrorInfo FUnrealCoreServerImpl::LoadClassInternal(LoadClassContext context)
{
	return true;
}

ErrorInfo FUnrealCoreServerImpl::StaticClassInternal(StaticClassContext context)
{
	return true;
}

ErrorInfo FUnrealCoreServerImpl::BindDelegateInternal(BindDelegateContext context)
{
	return true;
}

ErrorInfo FUnrealCoreServerImpl::UnbindDelegateInternal(UnbindDelegateContext context)
{
	return true;
}

ErrorInfo FUnrealCoreServerImpl::AddMultiDelegateInternal(AddMultiDelegateContext context)
{
	return true;
}

ErrorInfo FUnrealCoreServerImpl::RemoveMultiDelegateInternal(RemoveMultiDelegateContext context)
{
	return true;
}

ErrorInfo FUnrealCoreServerImpl::RegisterOverrideClassInternal(RegisterOverrideClassContext context)
{
	return true;
}

ErrorInfo FUnrealCoreServerImpl::UnregisterOverrideClassInternal(UnregisterOverrideClassContext context)
{
	return true;
}


