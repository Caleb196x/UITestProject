#include "ContainerTypeAdapter.h"

TMap<FString, FContainerTypeAdapter::OperatorFunction> FContainerTypeAdapter::ArrayOperatorFunctions = {};
TMap<FString, FContainerTypeAdapter::OperatorFunction> FContainerTypeAdapter::SetOperatorFunctions = {};
TMap<FString, FContainerTypeAdapter::OperatorFunction> FContainerTypeAdapter::MapOperatorFunctions = {};

void* FContainerTypeAdapter::NewContainer(const FString& TypeName, FProperty* InValueProp, FProperty* InKeyProp)
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
		
		return new FScriptArrayExtension(InValueProp);
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
	// array operators
	ArrayOperatorFunctions.Add("Num", &FArrayContainerAdapter::Num);
	ArrayOperatorFunctions.Add("Add", &FArrayContainerAdapter::Add);
	ArrayOperatorFunctions.Add("Get", &FArrayContainerAdapter::Get);
	ArrayOperatorFunctions.Add("Set", &FArrayContainerAdapter::Set);
	ArrayOperatorFunctions.Add("RemoveAt", &FArrayContainerAdapter::RemoveAt);
	ArrayOperatorFunctions.Add("Contains", &FArrayContainerAdapter::Contains);
	ArrayOperatorFunctions.Add("FindIndex", &FArrayContainerAdapter::FindIndex);
	ArrayOperatorFunctions.Add("IsValidIndex", &FArrayContainerAdapter::IsValidIndex);
	ArrayOperatorFunctions.Add("Empty", &FArrayContainerAdapter::Empty);

	// set operators
	SetOperatorFunctions.Add("Num", &FSetContainerTypeAdapter::Num);
	SetOperatorFunctions.Add("Get", &FSetContainerTypeAdapter::Get);
	SetOperatorFunctions.Add("Add", &FSetContainerTypeAdapter::Add);
	SetOperatorFunctions.Add("RemoveAt", &FSetContainerTypeAdapter::RemoveAt);
	SetOperatorFunctions.Add("FindIndex", &FSetContainerTypeAdapter::FindIndex);
	SetOperatorFunctions.Add("Contains", &FSetContainerTypeAdapter::Contains);
	SetOperatorFunctions.Add("GetMaxIndex", &FSetContainerTypeAdapter::GetMaxIndex);
	SetOperatorFunctions.Add("IsValidIndex", &FSetContainerTypeAdapter::IsValidIndex);
	SetOperatorFunctions.Add("Empty", &FSetContainerTypeAdapter::Empty);

	// map operators
	MapOperatorFunctions.Add("Num", &FMapContainerTypeAdapter::Num);
	MapOperatorFunctions.Add("Get", &FMapContainerTypeAdapter::Get);
	MapOperatorFunctions.Add("Add", &FMapContainerTypeAdapter::Add);
	MapOperatorFunctions.Add("Set", &FMapContainerTypeAdapter::Set);
	MapOperatorFunctions.Add("RemoveAt", &FMapContainerTypeAdapter::RemoveAt);
	MapOperatorFunctions.Add("GetMaxIndex", &FMapContainerTypeAdapter::GetMaxIndex);
	MapOperatorFunctions.Add("IsValidIndex", &FMapContainerTypeAdapter::IsValidIndex);
	MapOperatorFunctions.Add("GetKey", &FMapContainerTypeAdapter::GetKey);
	MapOperatorFunctions.Add("Empty", &FMapContainerTypeAdapter::Empty);
	
}

bool FContainerTypeAdapter::CallOperator(void* Container, const FString& TypeName,
	const FString& OperatorName, const std::vector<void*>& Params,
	std::vector<std::pair<std::string /*rpc type*/, std::pair<std::string/*ue type*/, void*>>>& Outputs)
{
	if (TypeName.Equals("Array"))
	{
		if (!ArrayOperatorFunctions.Contains(OperatorName))
		{
			UE_LOG(LogUnrealPython, Error, TEXT("Not exist operator function %s for array"), *OperatorName)
			return false;
		}
			
		return ArrayOperatorFunctions[OperatorName](Container, Params, Outputs);
	}
	else if (TypeName.Equals("Set"))
	{
		if (!SetOperatorFunctions.Contains(OperatorName))
		{
			UE_LOG(LogUnrealPython, Error, TEXT("Not exist operator function %s for set"), *OperatorName)
			return false;
		}

		return SetOperatorFunctions[OperatorName](Container, Params, Outputs);
	}
	else if (TypeName.Equals("Map"))
	{
		if (!MapOperatorFunctions.Contains(OperatorName))
		{
			UE_LOG(LogUnrealPython, Error, TEXT("Not exist operator function %s for map"), *OperatorName)
			return false;
		}

		return MapOperatorFunctions[OperatorName](Container, Params, Outputs);
	}
	else
	{
		UE_LOG(LogUnrealPython, Error, TEXT("Not support container type %s"), *TypeName)
		return false;
	}

	return true;
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

#define SET_CONTAINER_INNER_PROPERTY(name) \
		FScriptArrayExtension* ArrayContainer = static_cast<FScriptArrayExtension*>(Container); \
		auto name = ArrayContainer->ValueProperty; \
		if (!name->IsPropertyValid()) \
		{ \
			return false; \
		} \

// Array
bool FArrayContainerAdapter::Add(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_CONTAINER_INNER_PROPERTY(InnerProp)

	const int32 ElementNum = InputParams.size();
	AddUninitialized(&ArrayContainer->Data, GetSizeWithAlignment(InnerProp->GetProperty()), ElementNum);
	for (int i = 0; i < ElementNum; ++i)
	{
		
	}

	return true;
}

bool FArrayContainerAdapter::Contains(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}

bool FArrayContainerAdapter::Empty(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}

bool FArrayContainerAdapter::Get(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}

bool FArrayContainerAdapter::Num(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}

bool FArrayContainerAdapter::Set(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	SET_CONTAINER_INNER_PROPERTY(InnerProp)

	
	
	return true;
}

bool FArrayContainerAdapter::FindIndex(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}

bool FArrayContainerAdapter::RemoveAt(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}

bool FArrayContainerAdapter::IsValidIndex(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}

// Set
bool FSetContainerTypeAdapter::Add(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}

bool FSetContainerTypeAdapter::Contains(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}

bool FSetContainerTypeAdapter::Empty(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}

bool FSetContainerTypeAdapter::Get(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}

bool FSetContainerTypeAdapter::Num(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}

bool FSetContainerTypeAdapter::FindIndex(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}

bool FSetContainerTypeAdapter::RemoveAt(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}

bool FSetContainerTypeAdapter::IsValidIndex(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}

bool FSetContainerTypeAdapter::GetMaxIndex(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}


// Map
bool FMapContainerTypeAdapter::Add(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}

bool FMapContainerTypeAdapter::Get(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}

bool FMapContainerTypeAdapter::Empty(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}

bool FMapContainerTypeAdapter::Num(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}

bool FMapContainerTypeAdapter::Set(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}

bool FMapContainerTypeAdapter::GetKey(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}

bool FMapContainerTypeAdapter::RemoveAt(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}

bool FMapContainerTypeAdapter::GetMaxIndex(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}

bool FMapContainerTypeAdapter::IsValidIndex(void* Container, const std::vector<void*>& InputParams,
			std::vector<std::pair<std::string, std::pair<std::string, void*>>>& Outs)
{
	return true;
}
