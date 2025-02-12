#include "ContainerTypeAdapter.h"

TMap<FString, std::shared_ptr<FContainerTypeAdapter::OperatorFunction>> FContainerTypeAdapter::ArrayOperatorFunctions = {};
TMap<FString, std::shared_ptr<FContainerTypeAdapter::OperatorFunction>> FContainerTypeAdapter::SetOperatorFunctions = {};
TMap<FString, std::shared_ptr<FContainerTypeAdapter::OperatorFunction>> FContainerTypeAdapter::MapOperatorFunctions = {};
FString FContainerTypeAdapter::CallOperatorErrorMessage = "";
bool FContainerTypeAdapter::bIsInitialized = false;

void* FContainerTypeAdapter::NewContainer(const FString& TypeName, FProperty* InValueProp, FProperty* InKeyProp, int32 ArrayCounts)
{
	if (TypeName.Equals("Map"))
	{
		if (InKeyProp)
		{
			return new FScriptMapExtension(InKeyProp, InValueProp); // fixme@Caleb196x: initialize elements
		}
			
		UE_LOG(LogUnrealPython, Error, TEXT("Failed to create FScriptMapExtension, key property is invalid"));
		return nullptr;
	}

	if (TypeName.Equals("Array"))
	{
		
		return new FScriptArrayExtension(InValueProp, ArrayCounts);
	}

	if (TypeName.Equals("Set"))
	{
		return new FScriptSetExtension(InValueProp);
	}

	UE_LOG(LogUnrealPython, Error, TEXT("Not supported container type %s"), *TypeName);
	return nullptr;
}

bool FContainerTypeAdapter::DestroyContainer(void* Container, const FString& TypeName)
{
	if (TypeName.Equals("Map"))
	{
		FScriptMapExtension* MapContainer = static_cast<FScriptMapExtension*>(Container);
		MapContainer->Empty();
		delete MapContainer;
		MapContainer = nullptr;
		return true;
	}

	if (TypeName.Equals("Array"))
	{
		FScriptArrayExtension* ArrayContainer = static_cast<FScriptArrayExtension*>(Container);
		ArrayContainer->Empty();
		delete ArrayContainer;
		ArrayContainer = nullptr;
		return true;
	}

	if (TypeName.Equals("Set"))
	{
		FScriptSetExtension* SetContainer = static_cast<FScriptSetExtension*>(Container);
		SetContainer->Empty();
		delete SetContainer;
		SetContainer = nullptr;
		return true;
	}
	
	return false;
}


void FContainerTypeAdapter::Init()
{
	if (bIsInitialized)
	{
		return;
	}
	
	bIsInitialized = true;
	// array operators
	ArrayOperatorFunctions.Add("Num", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FArrayContainerAdapter::Num));
	ArrayOperatorFunctions.Add("Add", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FArrayContainerAdapter::Add));
	ArrayOperatorFunctions.Add("Get", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FArrayContainerAdapter::Get));
	ArrayOperatorFunctions.Add("Set", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FArrayContainerAdapter::Set));
	ArrayOperatorFunctions.Add("RemoveAt", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FArrayContainerAdapter::RemoveAt));
	ArrayOperatorFunctions.Add("Contains", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FArrayContainerAdapter::Contains));
	ArrayOperatorFunctions.Add("FindIndex", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FArrayContainerAdapter::FindIndex));
	ArrayOperatorFunctions.Add("IsValidIndex", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FArrayContainerAdapter::IsValidIndex));
	ArrayOperatorFunctions.Add("Empty", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FArrayContainerAdapter::Empty));

	// set operators
	SetOperatorFunctions.Add("Num", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FSetContainerTypeAdapter::Num));
	SetOperatorFunctions.Add("Get", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FSetContainerTypeAdapter::Get));
	SetOperatorFunctions.Add("Add", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FSetContainerTypeAdapter::Add));
	SetOperatorFunctions.Add("RemoveAt", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FSetContainerTypeAdapter::RemoveAt));
	SetOperatorFunctions.Add("FindIndex", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FSetContainerTypeAdapter::FindIndex));
	SetOperatorFunctions.Add("Contains", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FSetContainerTypeAdapter::Contains));
	SetOperatorFunctions.Add("GetMaxIndex", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FSetContainerTypeAdapter::GetMaxIndex));
	SetOperatorFunctions.Add("IsValidIndex", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FSetContainerTypeAdapter::IsValidIndex));
	SetOperatorFunctions.Add("Empty", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FSetContainerTypeAdapter::Empty));

	// map operators
	MapOperatorFunctions.Add("Num", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FMapContainerTypeAdapter::Num));
	MapOperatorFunctions.Add("Get", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FMapContainerTypeAdapter::Get));
	MapOperatorFunctions.Add("Add", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FMapContainerTypeAdapter::Add));
	MapOperatorFunctions.Add("Set", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FMapContainerTypeAdapter::Set));
	MapOperatorFunctions.Add("Remove", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FMapContainerTypeAdapter::Remove));
	MapOperatorFunctions.Add("GetMaxIndex", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FMapContainerTypeAdapter::GetMaxIndex));
	MapOperatorFunctions.Add("IsValidIndex", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FMapContainerTypeAdapter::IsValidIndex));
	MapOperatorFunctions.Add("GetKey", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FMapContainerTypeAdapter::GetKey));
	MapOperatorFunctions.Add("Empty", std::make_shared<FContainerTypeAdapter::OperatorFunction>(FMapContainerTypeAdapter::Empty));
	
}

bool FContainerTypeAdapter::CallOperator(void* Container, const FString& TypeName,
	const FString& OperatorName, const std::vector<void*>& Params,
	std::vector<std::pair<std::string /*rpc type*/, std::pair<std::string/*ue type*/, void*>>>& Outputs, FString& OutErrMsg)
{
	Init();
	
	bool CallResult = false;
	CallOperatorErrorMessage = "";
	if (TypeName.Equals("Array"))
	{
		if (!ArrayOperatorFunctions.Contains(OperatorName))
		{
			OutErrMsg = FString::Printf(TEXT("Not exist operator function %s for array"), *OperatorName);
			UE_LOG(LogUnrealPython, Error, TEXT("%s"), *OutErrMsg)
			return false;
		}
		
		const auto OperatorFunc = ArrayOperatorFunctions[OperatorName];
		CallResult = OperatorFunc->operator()(Container, Params, Outputs);
		
		OutErrMsg = CallOperatorErrorMessage;
	}
	else if (TypeName.Equals("Set"))
	{
		if (!SetOperatorFunctions.Contains(OperatorName))
		{
			OutErrMsg = FString::Printf(TEXT("Not exist operator function %s for set"), *OperatorName);
			UE_LOG(LogUnrealPython, Error, TEXT("%s"), *OutErrMsg)
			return false;
		}

		const auto OperatorFunc = SetOperatorFunctions[OperatorName];
		CallResult = OperatorFunc->operator()(Container, Params, Outputs);
		
		OutErrMsg = CallOperatorErrorMessage;
	}
	else if (TypeName.Equals("Map"))
	{
		if (!MapOperatorFunctions.Contains(OperatorName))
		{
			OutErrMsg = FString::Printf(TEXT("Not exist operator function %s for map"), *OperatorName);
			UE_LOG(LogUnrealPython, Error, TEXT("%s"), *OutErrMsg)
			return false;
		}

		const auto OperatorFunc = MapOperatorFunctions[OperatorName];
		CallResult = OperatorFunc->operator()(Container, Params, Outputs);
		
		OutErrMsg = CallOperatorErrorMessage;
	}
	else
	{
		OutErrMsg = FString::Printf(TEXT("Not support container type %s"), *TypeName);
		UE_LOG(LogUnrealPython, Error, TEXT("%s"), *OutErrMsg)
	}

	return CallResult;
}

#define ADD_BUILTIN_PROPERTY_TYPE(type, name) \
	FProperty* Prop##name = new type(PropertyMetaRoot, NAME_None, RF_Transient); \
	Prop##name->PropertyFlags |= CPF_HasGetValueTypeHash; \
	PropertiesCacheMap.Add(#name, Prop##name); \

void FContainerElementTypePropertyManager::Init()
{
	FBoolProperty* BoolProp = new FBoolProperty(PropertyMetaRoot, NAME_None, RF_Transient);
	BoolProp->SetBoolSize(1, true, 0xFF);
	PropertiesCacheMap.Add("bool", BoolProp);

	ADD_BUILTIN_PROPERTY_TYPE(FByteProperty, byte)
	ADD_BUILTIN_PROPERTY_TYPE(FIntProperty, int32)
	ADD_BUILTIN_PROPERTY_TYPE(FInt64Property, int)
	ADD_BUILTIN_PROPERTY_TYPE(FUInt32Property, uint32)
	ADD_BUILTIN_PROPERTY_TYPE(FUInt64Property, uint)
	ADD_BUILTIN_PROPERTY_TYPE(FDoubleProperty, float)
	ADD_BUILTIN_PROPERTY_TYPE(FStrProperty, str)
}

FProperty* FContainerElementTypePropertyManager::GetPropertyFromTypeName(const FString& PropertyTypeName)
{
	if (PropertiesCacheMap.Contains(PropertyTypeName))
	{
		return PropertiesCacheMap[PropertyTypeName];
	}

	UField* Type = FindAnyType<UClass>(PropertyTypeName);

	if (!Type)
	{
		Type = FindAnyType<UScriptStruct>(PropertyTypeName);
	}
	
	if (!Type)
	{
		Type = FindAnyType<UEnum>(PropertyTypeName);
	}
	
	if (!Type)
	{
		Type = LoadObject<UClass>(nullptr, *PropertyTypeName);
	}

	if (!Type)
	{
		Type = LoadObject<UScriptStruct>(nullptr, *PropertyTypeName);
	}

	if (!Type)
	{
		Type = LoadObject<UEnum>(nullptr, *PropertyTypeName);
	}

	if (!Type)
	{
		UE_LOG(LogUnrealPython, Error, TEXT("Can not find property type %s"), *PropertyTypeName);
		return nullptr;
	}

	FProperty* Ret = nullptr;
	if (auto Class = Cast<UClass>(Type))
	{
		Ret = new FObjectProperty(PropertyMetaRoot, NAME_None, RF_Transient);
		static_cast<FObjectProperty*>(Ret)->PropertyClass = Class;
		Ret->PropertyFlags |= CPF_HasGetValueTypeHash;
	}
	else if (auto ScriptStruct = Cast<UScriptStruct>(Type))
	{
		Ret = new FStructProperty(PropertyMetaRoot, NAME_None, RF_Transient);
		static_cast<FStructProperty*>(Ret)->Struct = ScriptStruct;
		Ret->ElementSize = ScriptStruct->PropertiesSize;
		Ret->PropertyFlags |= CPF_HasGetValueTypeHash;
	}
	else if (auto Enum = Cast<UEnum>(Type))
	{
		if (Enum->GetCppForm() == UEnum::ECppForm::EnumClass)
		{
			FEnumProperty* EnumProp =
#if ENGINE_MAJOR_VERSION > 4 && ENGINE_MINOR_VERSION > 4    // 5.5+
				new FEnumProperty(PropertyMetaRoot, NAME_None, RF_Transient);
			EnumProp->SetEnum(Enum);
#else
				new FEnumProperty(PropertyMetaRoot, NAME_None, RF_Transient, 0, CPF_HasGetValueTypeHash, Enum);
#endif
			FNumericProperty* UnderlyingProp = new FByteProperty(EnumProp, TEXT("UnderlyingType"), RF_Transient);
			EnumProp->AddCppProperty(UnderlyingProp);
			EnumProp->ElementSize = UnderlyingProp->ElementSize;
			EnumProp->PropertyFlags |= CPF_IsPlainOldData | CPF_NoDestructor | CPF_ZeroConstructor;

			Ret = EnumProp;
		}
		else
		{
			FByteProperty* ByteProp = new FByteProperty(PropertyMetaRoot, NAME_None, RF_Transient);
			ByteProp->Enum = Enum;

			Ret = ByteProp;
		}

		Ret->SetPropertyFlags(CPF_HasGetValueTypeHash);
	}
	else
	{
		UE_LOG(LogUnrealPython, Display, TEXT("Not support type"))
		return nullptr;
	}
	
	PropertiesCacheMap.Add(PropertyTypeName, Ret);
	return Ret;
}

/******************* Operator functions ********************/

#define SET_ARRAY_CONTAINER_INNER_PROPERTY(name, container) \
		FScriptArrayExtension* container = static_cast<FScriptArrayExtension*>(Container); \
		auto name = container->ValueProperty; \
		if (!name->IsPropertyValid()) \
		{ \
			return false; \
		} \

// Array
bool FArrayContainerAdapter::Add(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_ARRAY_CONTAINER_INNER_PROPERTY(InnerProp, ArrayContainer)

	const int32 ElementNum = InputParams.size();
	const int32 Index =AddUninitialized(&ArrayContainer->InnerArray, GetSizeWithAlignment(InnerProp->GetProperty()), ElementNum);
	for (int i = 0; i < ElementNum; ++i)
	{
		uint8* Data = ArrayContainer->GetData(ElementNum, Index + i);
		InnerProp->GetProperty()->InitializeValue(Data);
		InnerProp->CopyToUeValueInContainer(InputParams[i], Data);
	}

	Outs.push_back(std::make_pair("void", std::make_pair("void", nullptr)));

	return true;
}

bool FArrayContainerAdapter::Contains(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_ARRAY_CONTAINER_INNER_PROPERTY(InnerProp, ArrayContainer)

	int32 Index = FindIndexInternal(Container, InputParams);

	bool* ResPtr = new bool();
	if (INDEX_NONE == Index)
	{
		*ResPtr = false;
	}
	else
	{
		*ResPtr = true;
	}
	Outs.push_back(std::make_pair("bool", std::make_pair("bool", ResPtr)));
	
	return true;
}

bool FArrayContainerAdapter::Empty(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_ARRAY_CONTAINER_INNER_PROPERTY(InnerProp, ArrayContainer)

	ArrayContainer->Empty();
	Outs.push_back(std::make_pair("void", std::make_pair("void", nullptr)));

	return true;
}

bool FArrayContainerAdapter::Get(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_ARRAY_CONTAINER_INNER_PROPERTY(InnerProp, ArrayContainer)

	int Index = 0;
	if (InputParams.size() > 0)
	{
		const int32* InputIndex = static_cast<int32*>(InputParams[0]);
		Index = *InputIndex;
	}

	if (Index < 0 || Index > ArrayContainer->InnerArray.Num())
	{
		FContainerTypeAdapter::SetErrorMessage(FString::Printf(TEXT("Index %d out of range when get array element"), Index));
		return false;
	}

	FProperty* Property = InnerProp->GetProperty();

	uint8* DataPtr = ArrayContainer->GetData(GetSizeWithAlignment(Property), Index);

	auto PropSize = Property->GetSize();
	void* RetVal = FMemory::Malloc(PropSize); // fixme@Caleb196x: free memory
	FMemory::Memzero(RetVal, PropSize); // fixme@Caleb196x: need type information to free memory
	InnerProp->ReadUeValueInContainer(DataPtr, RetVal);
	
	const FString OutParamTypeName = Property->GetCPPType();
	const std::string StdOutParamTypeName = TCHAR_TO_UTF8(*OutParamTypeName);
	const std::string OutParamTypeNameStr = FCoreUtils::ConvertUeTypeNameToRpcTypeName(OutParamTypeName);
	Outs.push_back(std::make_pair(OutParamTypeNameStr, std::make_pair(StdOutParamTypeName, RetVal)));
	
	return true;
}

bool FArrayContainerAdapter::Num(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_ARRAY_CONTAINER_INNER_PROPERTY(InnerProp, ArrayContainer)

	const int32 ArrayNum = ArrayContainer->InnerArray.Num();
	int32* RetVal = new int32(ArrayNum);
	Outs.push_back(std::make_pair("int", std::make_pair("int", RetVal)));
	
	return true;
}

bool FArrayContainerAdapter::Set(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_ARRAY_CONTAINER_INNER_PROPERTY(InnerProp, ArrayContainer)

	int Index = 0;
	if (InputParams.size() > 0)
	{
		const int32* InputIndex = static_cast<int32*>(InputParams[0]);
		Index = *InputIndex;
	}

	if (Index < 0 || Index > ArrayContainer->InnerArray.Num())
	{
		FContainerTypeAdapter::SetErrorMessage(FString::Printf(TEXT("Index %d out of range when set array element"), Index));
		return false;
	}

	if (InputParams.size() < 2)
	{
		FContainerTypeAdapter::SetErrorMessage(TEXT("Input parameters must contain a new element value"));
		return false;
	}
	
	uint8* DataPtr = ArrayContainer->GetData(GetSizeWithAlignment(InnerProp->GetProperty()), Index);

	InnerProp->GetProperty()->InitializeValue(DataPtr);
	InnerProp->CopyToUeValueInContainer(InputParams[1], DataPtr);
	Outs.push_back(std::make_pair("void", std::make_pair("void", nullptr)));

	return true;
}

bool FArrayContainerAdapter::FindIndex(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	const int32 Index = FindIndexInternal(Container, InputParams);

	int32* ResPtr = new int32();
	*ResPtr = Index;
	Outs.push_back(std::make_pair("int", std::make_pair("int32", ResPtr)));
	
	return true;
}

int32 FArrayContainerAdapter::FindIndexInternal(void* Container, const std::vector<void*>& InputParams)
{
	SET_ARRAY_CONTAINER_INNER_PROPERTY(InnerProp, ArrayContainer)

	int32 Result = INDEX_NONE;
	if (!InnerProp->IsPropertyValid())
	{
		return Result;
	}

	if (InputParams.size() == 0)
	{
		return Result;
	}

	FProperty* Property = InnerProp->GetProperty();
	void* Dest = FMemory_Alloca(GetSizeWithAlignment(Property));
	Property->InitializeValue(Dest);
	InnerProp->CopyToUeValueInContainer(InputParams[0], Dest);

	const int32 Num = ArrayContainer->InnerArray.Num();
	for (int32 i = 0; i < Num; ++i)
	{
		uint8* Src = ArrayContainer->GetData(GetSizeWithAlignment(Property), i);
		if (Property->Identical(Src, Dest))
		{
			Result = i;
			break;
		}
	}
	Property->DestroyValue(Dest);

	// todo@Caleb196x: maybe free dest memory
	return Result;
}

bool FArrayContainerAdapter::RemoveAt(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_ARRAY_CONTAINER_INNER_PROPERTY(InnerProp, ArrayContainer)
	
	int Index = 0;
	if (InputParams.size() > 0)
	{
		const int32* InputIndex = static_cast<int32*>(InputParams[0]);
		Index = *InputIndex;
	}

	if (Index < 0 || Index > ArrayContainer->InnerArray.Num())
	{
		FContainerTypeAdapter::SetErrorMessage(FString::Printf(TEXT("Index %d out of range when remove array element"), Index));
		return false;
	}

	ArrayContainer->Destruct(Index);
#if ENGINE_MAJOR_VERSION > 4
	ArrayContainer->InnerArray.Remove(Index, 1, GetSizeWithAlignment(InnerProp->GetProperty()), __STDCPP_DEFAULT_NEW_ALIGNMENT__);
#else
	ArrayContainer->InnerArray.Remove(Index, 1, GetSizeWithAlignment(InnerProp->GetProperty()));
#endif
	Outs.push_back(std::make_pair("void", std::make_pair("void", nullptr)));

	return true;
}

bool FArrayContainerAdapter::IsValidIndex(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_ARRAY_CONTAINER_INNER_PROPERTY(InnerProp, ArrayContainer)
	
	int Index = 0;
	if (InputParams.size() > 0)
	{
		const int32* InputIndex = static_cast<int32*>(InputParams[0]);
		Index = *InputIndex;
	}

	bool* ResPtr = new bool(ArrayContainer->InnerArray.IsValidIndex(Index));
	Outs.push_back(std::make_pair("bool", std::make_pair("bool", ResPtr)));
	
	return true;
}

#define SET_SET_CONTAINER_INNER_PROPERTY(name, container) \
		FScriptSetExtension* container = static_cast<FScriptSetExtension*>(Container); \
		auto name = container->ValueProperty; \
		if (!name->IsPropertyValid()) \
		{ \
			return false; \
		} \

int32 FindIndexInner(FScriptSetExtension* SetContainer, const std::vector<void*>& InputParams);

// Set
bool FSetContainerTypeAdapter::Add(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_SET_CONTAINER_INNER_PROPERTY(InnerProp, SetContainer)

	if (InputParams.size() == 0)
	{
		FContainerTypeAdapter::SetErrorMessage(TEXT("Input is empty when add new set's element."));
		return false;
	}
	
	FProperty* Property = InnerProp->GetProperty();
	void* Dest = FMemory_Alloca(GetSizeWithAlignment(Property));
	Property->InitializeValue(Dest);
	InnerProp->CopyToUeValueInContainer(InputParams[0], Dest);
	auto ScriptSetLayout = SetContainer->GetScriptSetLayout();
	SetContainer->InnerSet.Add(
		Dest, ScriptSetLayout,
		[Property](const void* Element) { return Property->GetValueTypeHash(Element); },
		[Property](const void* A, const void* B) { return Property->Identical(A, B); },
		[Property, Dest](void* Element){ Property->InitializeValue(Element); Property->CopySingleValue(Element, Dest);},
		[Property](void* Element) { Property->DestroyValue(Element); }
	);

	Property->DestroyValue(Dest);
	Outs.push_back(std::make_pair("void", std::make_pair("void", nullptr)));

	return true;
}

bool FSetContainerTypeAdapter::Empty(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_SET_CONTAINER_INNER_PROPERTY(InnerProp, SetContainer)

	SetContainer->Empty();
	Outs.push_back(std::make_pair("void", std::make_pair("void", nullptr)));

	return true;
}

bool FSetContainerTypeAdapter::Get(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_SET_CONTAINER_INNER_PROPERTY(InnerProp, SetContainer)

	int32 Index = 0;
	if (InputParams.size() > 0)
	{
		const int32* InputIndex = static_cast<int32*>(InputParams[0]);
		Index = *InputIndex;
	}

	if (!SetContainer->InnerSet.IsValidIndex(Index))
	{
		FContainerTypeAdapter::SetErrorMessage(TEXT("Invalid set index"));
		return false;
	}

	auto SetLayout = SetContainer->GetScriptSetLayout();
	void* Data = SetContainer->InnerSet.GetData(Index, SetLayout);

	auto PropSize = InnerProp->GetProperty()->GetSize(); // fixme@Caleb196x: maybe need align memory size
	void* RetVal = FMemory::Malloc(PropSize); // fixme@Caleb196x: free memory
	FMemory::Memzero(RetVal, PropSize); // fixme@Caleb196x: need type information to free memory
	InnerProp->CopyToUeValueInContainer(Data, RetVal);

	const FString OutParamTypeName = InnerProp->GetProperty()->GetCPPType();
	const std::string StdOutParamTypeName = TCHAR_TO_UTF8(*OutParamTypeName);
	const std::string OutParamTypeNameStr = FCoreUtils::ConvertUeTypeNameToRpcTypeName(OutParamTypeName);
	Outs.push_back(std::make_pair(OutParamTypeNameStr, std::make_pair(StdOutParamTypeName, RetVal)));
	
	return true;
}

bool FSetContainerTypeAdapter::Num(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_SET_CONTAINER_INNER_PROPERTY(InnerProp, SetContainer)

	int32 SetNum = SetContainer->InnerSet.Num();
	int32* RetPtr = new int32(SetNum);
	Outs.push_back(std::make_pair("int", std::make_pair("int32", RetPtr)));
	
	return true;
}

bool FSetContainerTypeAdapter::Contains(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_SET_CONTAINER_INNER_PROPERTY(InnerProp, SetContainer)
	
	if (InputParams.size() == 0)
	{
		FContainerTypeAdapter::SetErrorMessage(TEXT("Need element value in input params."));
		return false;
	}

	int32 Index = FindIndexInner(SetContainer, InputParams);
	bool* ResPtr = new bool();
	if (INDEX_NONE == Index)
	{
		*ResPtr = false;
	}
	else
	{
		*ResPtr = true;
	}
	
	Outs.push_back(std::make_pair("bool", std::make_pair("bool", ResPtr)));
	
	return true;
}

bool FSetContainerTypeAdapter::FindIndex(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_SET_CONTAINER_INNER_PROPERTY(InnerProp, SetContainer)
	
	if (InputParams.size() == 0)
	{
		FContainerTypeAdapter::SetErrorMessage(TEXT("Need element value in input params."));
		return false;
	}

	int32 Index = FindIndexInner(SetContainer, InputParams);
	int32* ResPtr = new int32(Index);

	Outs.push_back(std::make_pair("int", std::make_pair("int32", ResPtr)));
	
	return true;
}

int32 FindIndexInner(FScriptSetExtension* SetContainer, const std::vector<void*>& InputParams)
{
	check(InputParams.size() > 0)
	
	int32 Index = INDEX_NONE;
	FProperty* InnerProperty = SetContainer->ValueProperty->GetProperty();
	void* DataPtr = FMemory_Alloca(GetSizeWithAlignment(InnerProperty));
	InnerProperty->InitializeValue(DataPtr);

	SetContainer->ValueProperty->CopyToUeValueInContainer(InputParams[0], DataPtr);

	auto SetLayout = SetContainer->GetScriptSetLayout();
	Index = SetContainer->InnerSet.FindIndex(DataPtr, SetLayout,
	[InnerProperty](const void* Element) { return InnerProperty->GetValueTypeHash(Element); },
	[InnerProperty](const void* A, const void* B) { return InnerProperty->Identical(A, B); }
	);

	InnerProperty->DestroyValue(DataPtr);
	
	return Index;
}

bool FSetContainerTypeAdapter::RemoveAt(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_SET_CONTAINER_INNER_PROPERTY(InnerProp, SetContainer)
	
	int Index = 0;
	if (InputParams.size() > 0)
	{
		const int32* InputIndex = static_cast<int32*>(InputParams[0]);
		Index = *InputIndex;
	}

	if (!SetContainer->InnerSet.IsValidIndex(Index))
	{
		FContainerTypeAdapter::SetErrorMessage(TEXT("Invalid set index"));
		return false;
	}

	auto ScriptSetLayout = SetContainer->GetScriptSetLayout();
	SetContainer->Destruct(Index);
	SetContainer->InnerSet.RemoveAt(Index, ScriptSetLayout);
	Outs.push_back(std::make_pair("void", std::make_pair("void", nullptr)));

	return true;
}

bool FSetContainerTypeAdapter::IsValidIndex(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_SET_CONTAINER_INNER_PROPERTY(InnerProp, SetContainer)
	
	int Index = 0;
	if (InputParams.size() > 0)
	{
		const int32* InputIndex = static_cast<int32*>(InputParams[0]);
		Index = *InputIndex;
	}

	bool* ResPtr = new bool(SetContainer->InnerSet.IsValidIndex(Index));
	Outs.push_back(std::make_pair("bool", std::make_pair("bool", ResPtr)));
	return true;
}

bool FSetContainerTypeAdapter::GetMaxIndex(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_SET_CONTAINER_INNER_PROPERTY(InnerProp, SetContainer)

	uint32 MaxIndex = SetContainer->InnerSet.GetMaxIndex();

	uint32* ResPtr = new uint32(MaxIndex);
	Outs.push_back(std::make_pair("uint", std::make_pair("uint32", ResPtr)));
	
	return true;
}

#define SET_MAP_CONTAINER_INNER_PROPERTY(key, value, container) \
		FScriptMapExtension* container = static_cast<FScriptMapExtension*>(Container); \
		auto value = container->ValueProperty; \
		auto key = container->KeyProperty; \
		if (!value->IsPropertyValid() || !key->IsPropertyValid()) \
		{ \
		  return false; \
		} \

// Map
bool FMapContainerTypeAdapter::Add(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_MAP_CONTAINER_INNER_PROPERTY(KeyProp, ValueProp, MapContainer)

	if (InputParams.size() < 2)
	{
		FContainerTypeAdapter::SetErrorMessage(TEXT("Must input key and value in input params."));
		return false;
	}

	FProperty* KeyProperty = KeyProp->GetProperty();
	FProperty* ValProperty = ValueProp->GetProperty();

	void* KeyPtr = FMemory_Alloca(GetSizeWithAlignment(KeyProperty));
	KeyProp->GetProperty()->InitializeValue(KeyPtr);

	void* ValPtr = FMemory_Alloca(GetSizeWithAlignment(ValProperty));
	ValueProp->GetProperty()->InitializeValue(ValPtr);

	KeyProp->CopyToUeValueInContainer(InputParams[0], KeyPtr);
	ValueProp->CopyToUeValueInContainer(InputParams[1], ValPtr);

	auto SetLayout = MapContainer->GetScriptMapLayout();

	MapContainer->InnerMap.Add(
		KeyPtr, ValPtr, SetLayout,
		[KeyProperty](const void* ElementKey) { return KeyProperty->GetValueTypeHash(ElementKey); },
		[KeyProperty](const void* A, const void* B) { return KeyProperty->Identical(A, B); },
		[KeyProperty, KeyPtr](void* NewElementKey)
		{
			KeyProperty->InitializeValue(NewElementKey);
			KeyProperty->CopySingleValue(NewElementKey, KeyPtr);
		},
		[ValProperty, ValPtr](void* NewElementValue)
		{
			ValProperty->InitializeValue(NewElementValue);
			ValProperty->CopySingleValue(NewElementValue, ValPtr);
		},
		[ValProperty, ValPtr](void* ExistingElementValue) { ValProperty->CopySingleValue(ExistingElementValue, ValPtr); },
		[KeyProperty](void* ElementKey) { KeyProperty->DestroyValue(ElementKey); },
		[ValProperty](void* ElementValue) { ValProperty->DestroyValue(ElementValue); }
	);

	KeyProperty->DestroyValue(KeyPtr);
	ValProperty->DestroyValue(ValPtr);
	Outs.push_back(std::make_pair("void", std::make_pair("void", nullptr)));

	return true;
}

bool FMapContainerTypeAdapter::Get(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_MAP_CONTAINER_INNER_PROPERTY(KeyProp, ValueProp, MapContainer)
	
	if (InputParams.size() == 0)
	{
		FContainerTypeAdapter::SetErrorMessage(TEXT("Need key in input params when get map value."));
		return false;
	}
	
	FProperty* KeyProperty = KeyProp->GetProperty();
	FProperty* ValProperty = ValueProp->GetProperty();

	void* KeyPtr = FMemory_Alloca(GetSizeWithAlignment(KeyProperty));
	KeyProp->GetProperty()->InitializeValue(KeyPtr);
	KeyProp->CopyToUeValueInContainer(InputParams[0], KeyPtr);

	auto SetLayout = MapContainer->GetScriptMapLayout();
	void* ValPtr = MapContainer->InnerMap.FindValue(
		KeyPtr, SetLayout,
		[KeyProperty](const void* ElementKey) { return KeyProperty->GetValueTypeHash(ElementKey); },
		[KeyProperty](const void* A, const void* B) { return KeyProperty->Identical(A, B); }
	);

	if (ValPtr)
	{
		auto PropSize = ValProperty->GetSize(); // fixme@Caleb196x: maybe need align memory size
		void* RetVal = FMemory::Malloc(PropSize); // fixme@Caleb196x: free memory
		FMemory::Memzero(RetVal, PropSize); // fixme@Caleb196x: need type information to free memory
		ValueProp->CopyToUeValueInContainer(ValPtr, RetVal);
		
		const FString OutParamTypeName = ValProperty->GetCPPType();
		const std::string StdOutParamTypeName = TCHAR_TO_UTF8(*OutParamTypeName);
		const std::string OutParamTypeNameStr = FCoreUtils::ConvertUeTypeNameToRpcTypeName(OutParamTypeName);
		Outs.push_back(std::make_pair(OutParamTypeNameStr, std::make_pair(StdOutParamTypeName, RetVal)));
	
	}

	KeyProperty->DestroyValue(KeyPtr);
	
	return true;
}

bool FMapContainerTypeAdapter::Empty(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_MAP_CONTAINER_INNER_PROPERTY(KeyProp, ValueProp, MapContainer)

	MapContainer->Empty();
	Outs.push_back(std::make_pair("void", std::make_pair("void", nullptr)));

	return true;
}

bool FMapContainerTypeAdapter::Num(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_MAP_CONTAINER_INNER_PROPERTY(KeyProp, ValueProp, MapContainer)

	const int32 MapNum = MapContainer->InnerMap.Num();
	int32* RetPtr = new int32(MapNum);
	Outs.push_back(std::make_pair("int", std::make_pair("int32", RetPtr)));
	
	return true;
}

bool FMapContainerTypeAdapter::Set(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	Add(Container, InputParams, Outs);
	Outs.push_back(std::make_pair("void", std::make_pair("void", nullptr)));

	return true;
}

bool FMapContainerTypeAdapter::GetKey(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	Outs.push_back(std::make_pair("void", std::make_pair("void", nullptr)));

	return true;
}

bool FMapContainerTypeAdapter::Remove(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_MAP_CONTAINER_INNER_PROPERTY(KeyProp, ValueProp, MapContainer)

	if (InputParams.size() == 0)
	{
		FContainerTypeAdapter::SetErrorMessage(TEXT("Must input key in input params when remove map element."));
		return false;
	}
	
	FProperty* KeyProperty = KeyProp->GetProperty();
	
	void* KeyPtr = FMemory_Alloca(GetSizeWithAlignment(KeyProperty));
	KeyProperty->InitializeValue(KeyPtr);
	KeyProp->CopyToUeValueInContainer(InputParams[0], KeyPtr);

	auto SetLayout = MapContainer->GetScriptMapLayout();
	int32 Index = MapContainer->InnerMap.FindPairIndex(
		KeyPtr, SetLayout,
		[KeyProperty](const void* Key) { return KeyProperty->GetValueTypeHash(Key); },
		[KeyProperty](const void* A, const void* B) { return KeyProperty->Identical(A, B); }
	);

	if (Index == INDEX_NONE)
	{
		FContainerTypeAdapter::SetErrorMessage(TEXT("Can not find key"));
		return false;
	}

	MapContainer->Destruct(Index);
	MapContainer->InnerMap.RemoveAt(Index, SetLayout);

	KeyProperty->DestroyValue(KeyPtr);
	Outs.push_back(std::make_pair("void", std::make_pair("void", nullptr)));

	return true;
}

bool FMapContainerTypeAdapter::GetMaxIndex(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_MAP_CONTAINER_INNER_PROPERTY(KeyProp, ValueProp, MapContainer)
	
	const int32 MaxIndex = MapContainer->InnerMap.GetMaxIndex();
	int32* RetPtr = new int32(MaxIndex);
	Outs.push_back(std::make_pair("int", std::make_pair("int32", RetPtr)));
	
	return true;
}

bool FMapContainerTypeAdapter::IsValidIndex(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_MAP_CONTAINER_INNER_PROPERTY(KeyProp, ValueProp, MapContainer)

	if (InputParams.size() == 0)
	{
		FContainerTypeAdapter::SetErrorMessage(TEXT("Must input key when check index."));
		return false;
	}

	int32* Index = static_cast<int32*>(InputParams[0]);

	bool* ResPtr = new bool(MapContainer->InnerMap.IsValidIndex(*Index));
	Outs.push_back(std::make_pair("bool", std::make_pair("bool", ResPtr)));
	
	return true;
}
