#include "FunctionWrapper.h"
#include "UnrealPythonRpcLog.h"

#include <mutex>
#include <unordered_map>

#include "Misc/DefaultValueHelper.h"

static TMap<FName, TMap<FName, TMap<FName, FString>>> ParamDefaultMetas;
static TMap<FName, TMap<FName, FString>>* PC = nullptr;
static TMap<FName, FString>* PF = nullptr;

#if ENGINE_MAJOR_VERSION >= 5 && ENGINE_MINOR_VERSION >= 2
UE_DISABLE_OPTIMIZATION
#else
PRAGMA_DISABLE_OPTIMIZATION
#endif
static void AllFunctionParamsDefaultMetaDataInit()
{
#include "InitParamDefaultMetas.inl"
}
#if ENGINE_MAJOR_VERSION >= 5 && ENGINE_MINOR_VERSION >= 2
UE_ENABLE_OPTIMIZATION
#else
PRAGMA_ENABLE_OPTIMIZATION
#endif

std::once_flag ParamDefaultMetasInitFlag;

TMap<FName, FString>* GetAllFunctionParamsDefaultMetaData(UFunction* InFunction)
{
	std::call_once(ParamDefaultMetasInitFlag, AllFunctionParamsDefaultMetaDataInit);
	UClass* OuterClass = InFunction->GetOuterUClass();
	auto ClassParamDefaultMeta = ParamDefaultMetas.Find(OuterClass->GetFName());
	if (ClassParamDefaultMeta)
	{
		return ClassParamDefaultMeta->Find(InFunction->GetFName());
	}
	return nullptr;
}

void FFunctionWrapper::Init(UFunction* InFunction, bool bIsDelegate)
{
	check(InFunction);
	
	Function = InFunction;

	ParamsBufferSize = InFunction->PropertiesSize > InFunction->ParmsSize ?
		InFunction->PropertiesSize : InFunction->ParmsSize;
	
#if WITH_EDITOR
	FunctionName = Function->GetFName();
#endif
	
	if (!bIsDelegate)
	{
		UClass* OuterClass = InFunction->GetOuterUClass();
		bIsInterfaceFunction = OuterClass->HasAnyClassFlags(CLASS_Interface) && OuterClass != UInterface::StaticClass();
		bIsStatic = InFunction->HasAnyFunctionFlags(FUNC_Static);
	}
	else
	{
		bIsInterfaceFunction = false;
		bIsStatic = false;
	}

	Arguments.clear();

	bSkipWorldContextInArg0 = false;
	// parse all function arguments
	for (TFieldIterator<FProperty> PropIter(InFunction); PropIter && PropIter->PropertyFlags & CPF_Parm; ++PropIter)
	{
		FProperty* Property = *PropIter;
		static const FName WorldContextPinName(TEXT("__WorldContext"));
		if (bIsStatic && !InFunction->IsNative()
			&& Property->GetFName() == WorldContextPinName
			&& Property->GetFName() == WorldContextPinName
			)
		{
			bSkipWorldContextInArg0 = true;
		}

		if (Property->HasAnyPropertyFlags(CPF_ReturnParm))
		{
			Return = FPropertyWrapper::Create(Property);
		}
		else
		{
			Arguments.push_back(FPropertyWrapper::Create(Property));
		}
	}

	// setup argument's default value
	TMap<FName, FString>* MetaData = GetAllFunctionParamsDefaultMetaData(InFunction);
	if (!MetaData)
	{
		UE_LOG(LogUnrealPython, Warning, TEXT("Can not find %s meta data"), *InFunction->GetName());
		return;
	}

	for (TFieldIterator<FProperty> PropIter(InFunction); PropIter; ++PropIter)
	{
		auto Property = *PropIter;

		if (!Property->HasAnyPropertyFlags(CPF_Parm))
		{
			UE_LOG(LogUnrealPython, Display, TEXT("Skip property %s, it is not function parameter"), *Property->GetName());
			continue;
		}

		if (Property->HasAnyPropertyFlags(CPF_ReturnParm))
		{
			UE_LOG(LogUnrealPython, Display, TEXT("Skip return param %s"), *Property->GetName());
			continue;
		}

		FString* DefaultValueStrPtr = MetaData->Find(Property->GetFName());
		if (!DefaultValueStrPtr || DefaultValueStrPtr->IsEmpty())
		{
			UE_LOG(LogUnrealPython, Warning, TEXT("Can not find default value for %s"), *Property->GetName());
			continue;
		}

		if (!ArgumentDefaultValues)
		{
			ArgumentDefaultValues = FMemory::Malloc(ParamsBufferSize, 16);
			InFunction->InitializeStruct(ArgumentDefaultValues);
		}

		void* PropertyValuePtr = Property->ContainerPtrToValuePtr<void>(ArgumentDefaultValues);
		if (const FStructProperty* StructProp = CastField<FStructProperty>(Property))
		{
			if (StructProp->Struct == TBaseStructure<FVector>::Get())
			{
				FVector* Vector = StaticCast<FVector*>(PropertyValuePtr);
				FDefaultValueHelper::ParseVector(*DefaultValueStrPtr, *Vector);
			}
			else if (StructProp->Struct == TBaseStructure<FVector2D>::Get())
			{
				FVector2D* Vector  = StaticCast<FVector2D*>(PropertyValuePtr);
				FDefaultValueHelper::ParseVector2D(*DefaultValueStrPtr, *Vector);
			}
			else if (StructProp->Struct == TBaseStructure<FRotator>::Get())
			{
				// FRotator
				FRotator* Rotator = StaticCast<FRotator*>(PropertyValuePtr);
				FDefaultValueHelper::ParseRotator(*DefaultValueStrPtr, *Rotator);
			}
			else if (StructProp->Struct == TBaseStructure<FLinearColor>::Get())
			{
				FLinearColor* LinearColor = StaticCast<FLinearColor*>(PropertyValuePtr);
				FDefaultValueHelper::ParseLinearColor(*DefaultValueStrPtr, *LinearColor);
			}
			else if (StructProp->Struct == TBaseStructure<FColor>::Get())
			{
				// FColor
				FColor* Color = StaticCast<FColor*>(PropertyValuePtr);
				FDefaultValueHelper::ParseColor(*DefaultValueStrPtr, *Color);
			}
		}

#if ENGINE_MINOR_VERSION > 0 && ENGINE_MAJOR_VERSION > 4
		Property->ImportText_Direct(**DefaultValueStrPtr, PropertyValuePtr, nullptr, PPF_None);
#else
		Property->ImportText(**DefaultValuePtr, PropValuePtr, PPF_None, nullptr);
#endif
	}
}

void FFunctionWrapper::Call(UObject* CallObject, const std::vector<void*>& Params, std::map<std::string, void*>& Outputs/*第0个元素是return的返回值*/)
{
	TWeakObjectPtr<UFunction> CallFuncPtr = !bIsInterfaceFunction ? Function : CallObject->GetClass()->FindFunctionByName(Function->GetFName());
	void* CallStackParams = ParamsBufferSize > 0 ? FMemory_Alloca(ParamsBufferSize) : nullptr;
#if WITH_EDITOR
	if (!CallFuncPtr.IsValid())
	{
		CallFuncPtr = CallObject->GetClass()->FindFunctionByName(FunctionName);
		Init(CallFuncPtr.Get(), false);
	}
#endif
	FastCall(CallObject, CallFuncPtr.Get(), Params, Outputs, CallStackParams);
}

void FFunctionWrapper::CallStatic(const std::vector<void*>& Params, std::map<std::string, void*>& Outputs)
{
	if (!DefaultBindObject)
	{
		DefaultBindObject = Function->GetOuterUClass()->GetDefaultObject();
	}

	Call(DefaultBindObject, Params, Outputs);
}

void FFunctionWrapper::FastCall(
	UObject* CallObject,
	UFunction* CallFunction,
	const std::vector<void*>& Params,
	std::map<std::string/*  type name */, void*>& Outputs,
	void* StackParams) const
{
	if (StackParams)
	{
		FMemory::Memzero(StackParams, ParamsBufferSize);
		if (Return)
		{
			Return->GetProperty()->InitializeValue_InContainer(StackParams);
		}
	}

	FFrame NewStack(CallObject, CallFunction, StackParams, nullptr, CallFunction->ChildProperties);
	checkSlow(NewStack.Locals || CallFunction->ParmsSize == 0);
	FOutParmRec** LastOutParams = &NewStack.OutParms;
	int ParamIndex = 0;
	for (TFieldIterator<FProperty> PropIter(CallFunction); PropIter; ++PropIter)
	{
		FProperty* Property = *PropIter;
		FOutParmRec* Out = nullptr;
		if (Property->HasAnyPropertyFlags(CPF_OutParm))
		{
			CA_SUPPRESS(6263)
			Out = static_cast<FOutParmRec*>(FMemory_Alloca(sizeof(FOutParmRec)));
			Out->Property = Property;
			if (*LastOutParams)
			{
				(*LastOutParams)->NextOutParm = Out;
				LastOutParams = &(*LastOutParams)->NextOutParm;
			}
			else
			{
				*LastOutParams = Out;
			}
		}

		if (Property->HasAnyPropertyFlags(CPF_ReturnParm))
		{
			if (Property->HasAnyPropertyFlags(CPF_OutParm))
			{
				Out->PropAddr = Property->ContainerPtrToValuePtr<uint8>(StackParams);
			}

			continue;
		}

		// TODO: handle default value

		Property->InitializeValue_InContainer(StackParams);
		if (Property->HasAnyPropertyFlags(CPF_OutParm))
		{
			if (!Arguments[ParamIndex]->CopyToUeValueFastInContainer(Params[ParamIndex], StackParams, reinterpret_cast<void**>(&Out->PropAddr)))
			{
				UE_LOG(LogUnrealPython, Error, TEXT("Copy to ue value failed, property: %s"), *Property->GetName());
			}
		}
		else
		{
			// set argument value to property
			if (!Arguments[ParamIndex]->CopyToUeValueInContainer(Params[ParamIndex], StackParams))
			{
				UE_LOG(LogUnrealPython, Error, TEXT("Copy to ue value failed, property: %s"), *Property->GetName());
			}
		}

		++ParamIndex;
	}

	if (CallFunction->HasAllFunctionFlags(FUNC_HasOutParms))
	{
		if (*LastOutParams)
		{
			(*LastOutParams)->NextOutParm = nullptr;
		}
	}

	const bool bHasReturn = CallFunction->ReturnValueOffset != MAX_uint16;
	uint8* ReturnValAddr = bHasReturn ? static_cast<uint8*>(StackParams) + CallFunction->ReturnValueOffset : nullptr;
	CallFunction->Invoke(CallObject, NewStack, ReturnValAddr);

	if (Return)
	{
		// handle return value
		const FString ReturnTypeName = Return->GetProperty()->GetCPPType();
		const std::string ReturnTypeNameStr = ConvertUeTypeNameToRpcTypeName(ReturnTypeName);
		
		void* RetVal = FMemory::Malloc(Return->GetProperty()->GetSize());
		if (!Return->ReadUeValueInContainer(StackParams, RetVal))
		{
			UE_LOG(LogUnrealPython, Error, TEXT("Copy to ue value failed, property: %s"), *Return->GetProperty()->GetName());
		}
		Outputs[ReturnTypeNameStr] = RetVal;
		Return->GetProperty()->DestroyValue_InContainer(StackParams);
	}
	else
	{
		Outputs["void"] = nullptr;
	}

	LastOutParams = &NewStack.OutParms;
	for (int i = 0; i < Arguments.size(); ++i)
	{
		auto PropFlags = Arguments[i]->GetProperty()->PropertyFlags;
		if (PropFlags & CPF_OutParm)
		{
			if (PropFlags & CPF_Parm &&
				!(PropFlags & CPF_ConstParm) &&
				!(PropFlags & CPF_ReturnParm))
			{
				auto PropAddr = (*LastOutParams)->PropAddr;
				if (PropAddr >= static_cast<uint8*>(StackParams) &&
					PropAddr < static_cast<uint8*>(StackParams) + ParamsBufferSize)
				{
					// write outputs
					const FString OutParamTypeName = Arguments[i]->GetProperty()->GetCPPType();
					const std::string OutParamTypeNameStr = ConvertUeTypeNameToRpcTypeName(OutParamTypeName);
					// TODO: copy memory
					void* RetVal = FMemory::Malloc(Arguments[i]->GetProperty()->GetSize());
					if (!Arguments[i]->ReadUeValueInContainer(StackParams, RetVal))
					{
						UE_LOG(LogUnrealPython, Error, TEXT("Copy to ue value failed, property: %s"), *Arguments[i]->GetProperty()->GetName());
					}
					
					Outputs[OutParamTypeNameStr] = RetVal;
				}
				else
				{
					LastOutParams = &(*LastOutParams)->NextOutParm;
					continue;
				}
			}
			
			LastOutParams = &(*LastOutParams)->NextOutParm;
		}
		
	}
}

std::string FFunctionWrapper::ConvertUeTypeNameToRpcTypeName(const FString& TypeName)
{
	const std::string InName = TCHAR_TO_UTF8(*TypeName);

	std::unordered_map<std::string, std::string> TypeMapping = {
		{"FString", "str"},
		{"FText", "str"},
		{"FName", "str"},
		{"int8", "int"},
		{"int16", "int"},
		{"int32", "int"},
		{"int64", "int"},
		{"uint8", "uint"},
		{"uint16", "uint"},
		{"uint32", "uint"},
		{"uint64", "uint"},
		{"float", "float"},
		{"double", "float"},
		{"bool", "bool"}
	};

	if (TypeMapping.contains(InName))
	{
		return TypeMapping.at(InName);
	}
	else
	{
		return "object";
	}
}