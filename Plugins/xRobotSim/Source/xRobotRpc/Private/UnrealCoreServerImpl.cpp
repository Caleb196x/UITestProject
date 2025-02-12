#include "UnrealCoreServerImpl.h"
#include "ContainerTypeAdapter.h"
#include "CoreRpcUtils.h"
#include "ObjectHolder.h"

#if PLATFORM_WINDOWS
#include <windows.h>
#else
#include <string>
#include <iconv.h>
#endif

kj::String ConvertWStringToKjHeapString(const FString& WideStr) {
	std::wstring TmpStr = *WideStr; 
#if PLATFORM_WINDOWS
	int Utf8Size = WideCharToMultiByte(CP_UTF8, 0, TmpStr.c_str(), -1, nullptr, 0, nullptr, nullptr);
	std::vector<char> utf8Buffer(Utf8Size);
	WideCharToMultiByte(CP_UTF8, 0, TmpStr.c_str(), -1, utf8Buffer.data(), Utf8Size, nullptr, nullptr);
    
	return kj::heapString(utf8Buffer.data());
#else
	iconv_t conv = iconv_open("UTF-8", sizeof(wchar_t) == 2 ? "UTF-16LE" : "UTF-32LE");
	if (conv == (iconv_t)-1) return kj::heapString("");

	size_t inBytes = TmpStr.size() * sizeof(wchar_t);
	size_t outBytes = inBytes * 2;  
	std::vector<char> buffer(outBytes);

	char* inBuf = (char*)TmpStr.data();
	char* outBuf = buffer.data();
	iconv(conv, &inBuf, &inBytes, &outBuf, &outBytes);
	iconv_close(conv);

	return kj::heapString(buffer.data());
	
#endif
}

#define CHECK_RESULT_AND_RETURN(Result) \
	context = Result.Context; \
	if (!Result.Info.bIsSuccess) \
	{ \
		return kj::Promise<void>(kj::Exception(kj::Exception::Type::FAILED, \
			Result.Info.FileCStr(), Result.Info.Line, ConvertWStringToKjHeapString(Result.Info.Message))); \
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

kj::Promise<void> FUnrealCoreServerImpl::registerCreatedPyObject(RegisterCreatedPyObjectContext context)
{
	const auto Result = GameThreadDispatcher<RegisterCreatedPyObjectContext>::EnqueueToGameThreadExec(RegisterCreatedPyObjectInternal, context);
	CHECK_RESULT_AND_RETURN(Result)
}

kj::Promise<void> FUnrealCoreServerImpl::newContainer(NewContainerContext context)
{
	const auto Result = GameThreadDispatcher<NewContainerContext>::EnqueueToGameThreadExec(NewContainerInternal, context);
	CHECK_RESULT_AND_RETURN(Result)
}

kj::Promise<void> FUnrealCoreServerImpl::destroyContainer(DestroyContainerContext context)
{
	const auto Result = GameThreadDispatcher<DestroyContainerContext>::EnqueueToGameThreadExec(DestroyContainerInternal, context);
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

/******************** <Utils start> ******************************/

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


static bool ParseInputParamsToTypeFreeData(const capnp::List<UnrealCore::Argument>::Reader& InFuncParam,
											std::vector<void*>& OutParsedData, AutoMemoryFreer& AutoFreer)
{
	for (const auto& Param : InFuncParam)
	{
		const FString ParamClassName = UTF8_TO_TCHAR(Param.getUeClass().getTypeName().cStr());
		switch (Param.which())
		{
			case UnrealCore::Argument::INT_VALUE:
			{
				int64* DataPtr = new int64(Param.getIntValue());
				AutoFreer.AddPtr("int", DataPtr);
				OutParsedData.push_back(DataPtr);
				break;
			}
			case UnrealCore::Argument::STR_VALUE:
			{
				FString* DataPtr = new FString(UTF8_TO_TCHAR(Param.getStrValue().cStr()));
				AutoFreer.AddPtr("str", DataPtr);
				OutParsedData.push_back(DataPtr);
				break;
			}
			case UnrealCore::Argument::UINT_VALUE:
			{
				uint64* DataPtr = new uint64(Param.getUintValue());
				AutoFreer.AddPtr("uint", DataPtr);
				OutParsedData.push_back(DataPtr);
				break;
			}
			case UnrealCore::Argument::FLOAT_VALUE:
			{
				double* DataPtr = new double(Param.getFloatValue());
				AutoFreer.AddPtr("float", DataPtr);
				OutParsedData.push_back(DataPtr);
				break;
			}
			case UnrealCore::Argument::BOOL_VALUE:
			{
				bool* DataPtr = new bool(Param.getBoolValue());
				AutoFreer.AddPtr("bool", DataPtr);
				OutParsedData.push_back(DataPtr);
				break;
			}
			case UnrealCore::Argument::OBJECT:
			{
				FString TypeName = UTF8_TO_TCHAR(Param.getUeClass().getTypeName().cStr());
				void* Pointer = reinterpret_cast<void*>(Param.getObject().getAddress());
				// TODO: support cpp native type
				// fixme@Caleb196x: crash when passing into a null pointer
				// fixme@Caleb196x: 如果没有获取到ObjPointer，那么获取的指针就有问题，导致传递的参数也会有问题；
				if (const FObjectHolder::FUEObject* ObjPointer = FObjectHolder::Get().GetUObject(Pointer))
					OutParsedData.push_back(ObjPointer->Ptr);
				else
				{
					return false;
				}
					
				break;
			}
			case UnrealCore::Argument::ENUM_VALUE:
			{
				int64* EnumPtr = new int64(Param.getEnumValue());
				AutoFreer.AddPtr("enum", EnumPtr);
				OutParsedData.push_back(EnumPtr);
				break;
			}
			default:
				break;
		}
	}

	return true;
}


void ParseTypeAndSetValueForReturn(UnrealCore::Argument::Builder* RetValue,
		const std::string& RpcType, const std::string& UeType, void* Value)
{
	// fixme@Caleb196x: return ue class type name
	RetValue->initUeClass().setTypeName(UeType);
	RetValue->setName("return_value");

	if (RpcType == "bool")
	{
		bool* Result = static_cast<bool*>(Value);
		RetValue->setBoolValue(*Result);
		FMemory::Free(Result);
	}
	else if (RpcType == "int")
	{
		if (UeType == "int32" || UeType == "int32_t"
			|| UeType == "int16" || UeType == "int16_t"
			|| UeType == "int8" || UeType == "int8_t")
		{
			int32_t* Result = static_cast<int32_t*>(Value);
			RetValue->setIntValue(*Result);
			UE_LOG(LogUnrealPython, Warning, TEXT("int value: %lld"), *Result)
			FMemory::Free(Result);
		}
		else if (UeType == "int64" || UeType == "int64_t")
		{
			int64_t* Result = static_cast<int64_t*>(Value);
			RetValue->setIntValue(*Result);
			UE_LOG(LogUnrealPython, Warning, TEXT("int value: %lld"), *Result)
			FMemory::Free(Result);
		}
	}
	else if (RpcType == "uint")
	{
		if (UeType == "uint32" || UeType == "uint32_t"
			|| UeType == "uint16" || UeType == "uint16_t"
			|| UeType == "uint8" || UeType == "uint8_t")
		{
			uint32_t* Result = static_cast<uint32_t*>(Value);
			RetValue->setIntValue(*Result);
			UE_LOG(LogUnrealPython, Warning, TEXT("int value: %lld"), *Result)
			FMemory::Free(Result);
		}
		else if (UeType == "int64" || UeType == "int64_t")
		{
			uint64_t* Result = static_cast<uint64_t*>(Value);
			RetValue->setIntValue(*Result);
			UE_LOG(LogUnrealPython, Warning, TEXT("int value: %lld"), *Result)
			FMemory::Free(Result);
		}
	}
	else if (RpcType == "double")
	{
		if (UeType == "float")
		{
			float* Result = static_cast<float*>(Value);
			RetValue->setFloatValue(*Result);
			FMemory::Free(Result);
		}
		else
		{
			double* Result = static_cast<double*>(Value);
			RetValue->setFloatValue(*Result);
			FMemory::Free(Result);
		}
	}
	else if (RpcType == "str")
	{
		if (UeType == "FString")
		{
			FString* Result = static_cast<FString*>(Value);
			RetValue->setStrValue(TCHAR_TO_UTF8(**Result));
			FMemory::Free(Result);
		}
		else if (UeType == "FText")
		{
			FText* Result = static_cast<FText*>(Value);
			const FString Str = Result->ToString();
			RetValue->setStrValue(TCHAR_TO_UTF8(*Str));
			FMemory::Free(Result);
		}
		else if (UeType == "FName")
		{
			FName* Result = static_cast<FName*>(Value);
			const FString Str = Result->ToString();
			RetValue->setStrValue(TCHAR_TO_UTF8(*Str));
			FMemory::Free(Result);
		}
	}
	else if (RpcType == "object")
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
		// 解决思路2：
		// 直接在server端返回uobject对象，在client端接受后，创建新的pyobject，然后立即将pyobject和uobject注册到object holder
		auto InitObject = RetValue->initObject();
		InitObject.setAddress(reinterpret_cast<uint64>(Value));
		InitObject.setName(""); // todo@Caleb196x: 设置变量名
		RetValue->setObject(InitObject);
	}
	else if (RpcType == "void")
	{
		RetValue->initUeClass().setTypeName("void");
	}
	else if (RpcType == "enum")
	{
		int32_t* Result = static_cast<int32_t*>(Value);
		RetValue->setEnumValue(*Result);
		FMemory::Free(Result);
	}
}

static void SetupRpcReturnAndOutputParams(
		const std::vector<std::pair<std::string /*rpc type*/, std::pair<std::string/*ue type*/, void*>>>& OutParams,
		capnp::List<UnrealCore::Argument>::Builder& RpcOutParams,
		UnrealCore::Argument::Builder& RpcRet
	)
{
		
	auto Iter = OutParams.begin();
	if (Iter != OutParams.end())
	{
		auto ReturnTypeName = Iter->first;
		auto UeTypeWithValuePair = Iter->second;
		auto UeType = UeTypeWithValuePair.first;
		auto Value = UeTypeWithValuePair.second;
		ParseTypeAndSetValueForReturn(&RpcRet, ReturnTypeName, UeType, Value);

		++Iter;
	}
	
	for (int i = 0; i < OutParams.size() && Iter != OutParams.end(); ++i, ++Iter)
	{
		auto OutParam = *Iter;
		auto TypeName = OutParam.first;
		auto UeTypeWithValue = OutParam.second;
		auto UeType = UeTypeWithValue.first;
		auto Value = UeTypeWithValue.second;
		
		auto RetParam = RpcOutParams[i];
		RetParam.initUeClass().setTypeName(TypeName);
		ParseTypeAndSetValueForReturn(&RetParam, TypeName, UeType, Value);
		
		/*else if (TypeName == "object")
		{
			// find outer object from ObjectHolder
			auto OutObj = InitOutParams[i].initObject();

			UObject* ResultPtr = static_cast<UObject*>(Value);
			void* ObjPtr = FObjectHolder::Get().GetGrpcObject(ResultPtr);
			OutObj.setAddress(reinterpret_cast<uint64_t>(ObjPtr));
		}*/
	}

}

/******************** <Utils end> ******************************/

ErrorInfo FUnrealCoreServerImpl::NewObjectInternal(NewObjectContext context)
{
	const auto AllocClass = context.getParams().getUeClass();
	const auto Owner = context.getParams().getOwn();
	const auto NewObjName = context.getParams().getObjName();
	const auto Flags = context.getParams().getFlags();
	auto ConstructArgs = context.getParams().getConstructArgs();
	
	auto ResponseObj = context.getResults().initObject();
	
	const FString ClassName = UTF8_TO_TCHAR(AllocClass.getTypeName().cStr());
	void* ClientHolder = reinterpret_cast<void*>(Owner.getAddress());

	AutoMemoryFreer AutoFreer;

	// TODO: check address
	
	FObjectHolder::FUEObject* Obj = FObjectHolder::Get().GetUObject(ClientHolder);

	// TODO: handle create object failure
	if (!Obj)
	{
		FStructTypeAdapter* TypeContainer = FCoreUtils::LoadUEStructType(ClassName);
		if (!TypeContainer)
		{
			return ErrorInfo(__FILE__, __LINE__,
				FString::Printf(TEXT("Can not load type container for %s"), *ClassName));
		}

		// todo: pass to construct arguments
		std::vector<void*> Args;
		if (!ParseInputParamsToTypeFreeData(ConstructArgs, Args, AutoFreer))
		{
			return ErrorInfo(__FILE__, __LINE__,
				FString::Printf(TEXT("A non-existent object pointer was encountered while parsing a function parameter.")));
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
	auto Owner = context.getParams().getOwn();
	auto PointerAddr = Owner.getAddress();
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
	const auto OwnerClass = context.getParams().getUeClass();
	const auto OwnerObject = context.getParams().getOwner();
	const auto Property = context.getParams().getProperty();
	const FString PropertyName = UTF8_TO_TCHAR(Property.getName().cStr());
	FString PropertyTypeName = UTF8_TO_TCHAR(Property.getUeClass().getTypeName().cStr());
	
	void* ClientHolder = reinterpret_cast<void*>(OwnerObject.getAddress());
	
	FObjectHolder::FUEObject* Obj = FObjectHolder::Get().GetUObject(ClientHolder);
	if (!Obj)
	{
		return ErrorInfo(__FILE__, __LINE__, 
			FString::Printf(TEXT("Set property %s failed, can not find ue object for client object %p"),
				*PropertyName, ClientHolder));
	}

	const FString OwnerClassTypeName = UTF8_TO_TCHAR(OwnerClass.getTypeName().cStr());
	FStructTypeAdapter* TypeContainer = FCoreUtils::LoadUEStructType(OwnerClassTypeName);
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
			case UnrealCore::Argument::INT_VALUE:
				PropertyValue = new int64(Property.getIntValue());
				break;
			case UnrealCore::Argument::STR_VALUE:
				PropertyValue = new FString(UTF8_TO_TCHAR(Property.getStrValue().cStr()));
				break;
			case UnrealCore::Argument::UINT_VALUE:
				PropertyValue = new uint64(Property.getUintValue());
				break;
			case UnrealCore::Argument::FLOAT_VALUE:
				PropertyValue = new double(Property.getFloatValue());
				break;
			case UnrealCore::Argument::BOOL_VALUE:
				PropertyValue = new bool(Property.getBoolValue());
				break;
			case UnrealCore::Argument::OBJECT:
				PropertyValue = reinterpret_cast<void*>(Property.getObject().getAddress());
				break;
			case UnrealCore::Argument::ENUM_VALUE:
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
	const auto OwnerClass = context.getParams().getUeClass();
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
	FStructTypeAdapter* TypeContainer = FCoreUtils::LoadUEStructType(OwnerClassTypeName);
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
		Result.initUeClass().setTypeName(TCHAR_TO_UTF8(*UePropertyTypeName));
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

		if (PropertyWrapper->GetProperty()->IsA<FEnumProperty>())
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
	// parse pass in params
	auto Owner = context.getParams().getOwn();
	auto CallObject = context.getParams().getCallObject();
	FString FunctionName = UTF8_TO_TCHAR(context.getParams().getFuncName().cStr());
	auto InFuncParams = context.getParams().getParams();
	FString ClassName = UTF8_TO_TCHAR(context.getParams().getUeClass().getTypeName().cStr());

	FObjectHolder::FUEObject* FoundObject = nullptr;
	void* ClientHolder = reinterpret_cast<void*>(Owner.getAddress());
	if (!FObjectHolder::Get().HasObject(ClientHolder))
	{
		// throw exception to client
		return ErrorInfo(__FILE__, __LINE__,
			"Can not find the object in system's object holder, run newObject at first.");
	}

	FoundObject = FObjectHolder::Get().GetUObject(ClientHolder);
	UObject* PassedInObject = reinterpret_cast<UObject*>(CallObject.getAddress());
	
	if (FoundObject->Ptr != PassedInObject)
	{
		return ErrorInfo(__FILE__, __LINE__,
			FString::Printf(TEXT("Call function %s failed, the object found in object holder %p is not equal to passed by caller %p"),
				*FunctionName, FoundObject, PassedInObject));
	}
	
	if (!ClassName.Equals(FoundObject->ClassName))
	{
		return ErrorInfo(__FILE__, __LINE__,
			FString::Printf(TEXT("Class name passed from client: %s is not equal to class name saved in object holder: %s"),
				*ClassName, *FoundObject->ClassName));
	}

	AutoMemoryFreer AutoFreer;

	// TODO: use any at beta it maybe has some performance issue
	std::vector<void*> PassToParams;
	if (!ParseInputParamsToTypeFreeData(InFuncParams, PassToParams, AutoFreer /* add new ptr to freer */))
	{
		return ErrorInfo(__FILE__, __LINE__,
			FString::Printf(TEXT("A non-existent object pointer was encountered while parsing a function parameter.")));
	}

	std::vector<std::pair<std::string /*rpc type*/, std::pair<std::string/*ue type*/, void*>>> OutParams;

	if (FoundObject && FoundObject->MetaTypeName.Equals("UClass"))
	{
		auto* TypeContainer = FCoreUtils::GetUEStructType(ClassName);
		if (!TypeContainer)
		{
			return ErrorInfo(__FILE__, __LINE__,
				FString::Printf(TEXT("Can not find type container for class %s"), *ClassName));
		}
		auto FuncWrapper = TypeContainer->FindFunction(FunctionName);
		if (!FuncWrapper)
		{
			return ErrorInfo(__FILE__, __LINE__,
				FString::Printf(TEXT("Can not find function %s for class %s"), *FunctionName, *ClassName));
		}
		
		UObject* ObjPtr = static_cast<UObject*>(FoundObject->Ptr);
		FuncWrapper->Call(ObjPtr, PassToParams, OutParams);
	}
	else if (FoundObject && FoundObject->MetaTypeName.Equals("Container"))
	{
		FString ErrorMessage;
		if (!FContainerTypeAdapter::CallOperator(FoundObject->Ptr, FoundObject->ClassName,
							FunctionName, PassToParams, OutParams, ErrorMessage))
		{
			return ErrorInfo(__FILE__, __LINE__,
				FString::Printf(TEXT("Run container operator function %s failed, failure reason %s"),
					*FunctionName, *ErrorMessage));
		}
	}
	else
	{
		return ErrorInfo(__FILE__, __LINE__,
			FString::Printf(TEXT("Can not call function  %s on %s, only call function on the UClass"),
				*FunctionName, *FoundObject->ClassName));
	}

	auto Ret = context.getResults().initReturn();
	auto InitOutParams = context.getResults().initOutParams(OutParams.size() - 1);
	SetupRpcReturnAndOutputParams(OutParams, InitOutParams, Ret);

	return true;
}

ErrorInfo FUnrealCoreServerImpl::CallStaticFunctionInternal(CallStaticFunctionContext context)
{
	auto InFuncParam = context.getParams().getParams();
	FString ClassName = UTF8_TO_TCHAR(context.getParams().getUeClass().getTypeName().cStr());
	FString FunctionName = UTF8_TO_TCHAR(context.getParams().getFuncName().cStr());
	
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
	ParseInputParamsToTypeFreeData(InFuncParam, PassToParams, AutoFreer);

	std::vector<std::pair<std::string /*rpc type*/, std::pair<std::string/*ue type*/, void*>>> OutParams;
	
	FuncWrapper->CallStatic(PassToParams, OutParams);
	
	auto Ret = context.getResults().initReturn();
	auto InitOutParams = context.getResults().initOutParams(OutParams.size() - 1);
	SetupRpcReturnAndOutputParams(OutParams, InitOutParams, Ret);

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

ErrorInfo FUnrealCoreServerImpl::RegisterCreatedPyObjectInternal(RegisterCreatedPyObjectContext context)
{
	const auto PyObject = context.getParams().getPyObject();
	const auto UnrealObject = context.getParams().getUnrealObject();
	const auto UeClass = context.getParams().getUeClass();

	const FString ClassName = UTF8_TO_TCHAR(UeClass.getTypeName().cStr());
	void* PyObjectPtr = reinterpret_cast<void*>(PyObject.getAddress());
	void* UnrealObjectPtr = reinterpret_cast<void*>(UnrealObject.getAddress());

	FStructTypeAdapter* TypeContainer = FCoreUtils::LoadUEStructType(ClassName);
	if (!TypeContainer)
	{
		return ErrorInfo(__FILE__, __LINE__,
			FString::Printf(TEXT("Can not load type container for %s"), *ClassName));
	}
	
	FObjectHolder::Get().RegisterToRetainer(PyObjectPtr, UnrealObjectPtr, TypeContainer->GetMetaTypeName(), ClassName);

	return true;
}

ErrorInfo FUnrealCoreServerImpl::NewContainerInternal(NewContainerContext context)
{
	// input from client
	const auto Own = context.getParams().getOwn();
	void* const ClientObject = reinterpret_cast<void* const>(Own.getAddress());
	
	const FString ContainerType = UTF8_TO_TCHAR(context.getParams().getContainerType().getTypeName().cStr());

	FProperty* KeyProp = nullptr;
	FProperty* ValProp = nullptr;
	if (ContainerType.Equals("Map") && context.getParams().hasKeyType())
	{
		const FString KeyPropertyTypeName = UTF8_TO_TCHAR(context.getParams().getKeyType().getTypeName().cStr());
		const FString ValuePropertyTypeName = UTF8_TO_TCHAR(context.getParams().getValueType().getTypeName().cStr());
		KeyProp = FContainerElementTypePropertyManager::Get().GetPropertyFromTypeName(KeyPropertyTypeName);
		ValProp = FContainerElementTypePropertyManager::Get().GetPropertyFromTypeName(ValuePropertyTypeName);
		if (!ValProp)
		{
			return ErrorInfo(__FILE__, __LINE__,
				FString::Printf(TEXT("Can not load value property %s"), *ValuePropertyTypeName));
		}
		if (!KeyProp)
		{
			return ErrorInfo(__FILE__, __LINE__,
				FString::Printf(TEXT("Can not load key property %s"), *KeyPropertyTypeName));
		}
	}
	else
	{
		const FString ValuePropertyTypeName = UTF8_TO_TCHAR(context.getParams().getValueType().getTypeName().cStr());
		ValProp = FContainerElementTypePropertyManager::Get().GetPropertyFromTypeName(ValuePropertyTypeName);
		if (!ValProp)
		{
			return ErrorInfo(__FILE__, __LINE__,
				FString::Printf(TEXT("Can not load value property %s"), *ValuePropertyTypeName));
		}
	}

	int32 ArraySize = 1;
	auto Args = context.getParams().getArgs();
	for (auto Arg : Args)
	{
		// array size
		if (Arg.which() == UnrealCore::Argument::INT_VALUE &&
			strcmp(Arg.getName().cStr(), "size"))
		{
			ArraySize = Arg.getIntValue();
		}
		else
		{
			FString ArgName = UTF8_TO_TCHAR(Arg.getName().cStr());
			UE_LOG(LogUnrealPython, Error, TEXT("Not supported argument %s"), *ArgName);
		}
	}
	
	// todo@Caleb196x: consider the property type is container type
	// 根据type name，区分内置类型，反射类型，容器类型，分别创建不同property
	void* Container = FContainerTypeAdapter::NewContainer(ContainerType, ValProp, KeyProp, ArraySize);
	if (!Container)
	{
		return ErrorInfo(__FILE__, __LINE__,
			FString::Printf(TEXT("Failed to create container %s, maybe not support this container type"), *ContainerType));
	}
	
	FObjectHolder::FUEObject* Holder = FObjectHolder::Get().RegisterToRetainer(ClientObject, Container, "Container", ContainerType);
	
	auto ResultObj = context.getResults().initContainer();
	ResultObj.setAddress(reinterpret_cast<uint64_t>(Holder->Ptr));
	ResultObj.setName(""); // todo@Calbel196x: maybe generate a random container name
	
	return true;
}

ErrorInfo FUnrealCoreServerImpl::DestroyContainerInternal(DestroyContainerContext context)
{
	const auto Own = context.getParams().getOwn();
	void* const ClientObject = reinterpret_cast<void* const>(Own.getAddress());

	// 从内存管理器中查找容器对象指针
	const void* ContainerPtr = FObjectHolder::Get().GetUObject(ClientObject);
	if (!ContainerPtr)
	{
		return ErrorInfo(__FILE__, __LINE__,
			FString::Printf(TEXT("Can not find container object from ClientObject %p"), ClientObject));
	}

	FObjectHolder::Get().RemoveFromRetainer(ClientObject);
	
	return true;
}
