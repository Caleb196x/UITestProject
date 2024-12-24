#include "FunctionWrapper.h"
#include "UnrealPythonRpcLog.h"

#include <mutex>

#include "Misc/DefaultValueHelper.h"

namespace xRobotRpc
{
	static TMap<FName, TMap<FName, TMap<FName, FString>>> AllFunctionParamsDefaultMetaData;
	static TMap<FName, TMap<FName, FString>>* PC = nullptr;
	static TMap<FName, FString>* PF = nullptr;

	static void AllFunctionParamsDefaultMetaDataInit()
	{
#include "InitParamDefaultMetas.inl"
	}

	std::once_flag ParamDefaultMetasInitFlag;
	
	TMap<FName, FString>* GetAllFunctionParamsDefaultMetaData(UFunction* InFunction)
	{
		std::call_once(ParamDefaultMetasInitFlag, AllFunctionParamsDefaultMetaDataInit);
		UClass* OuterClass = InFunction->GetOuterUClass();
		auto ClassParamDefaultMeta = AllFunctionParamsDefaultMetaData.Find(OuterClass->GetFName());
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

	void FFunctionWrapper::Call(UObject* CallObject, const std::vector<std::any>& Params, std::vector<std::any>& Outputs/*第0个元素是return的返回值*/)
	{
		TWeakObjectPtr<UFunction> CallFuncPtr = !bIsInterfaceFunction ? Function : CallObject->GetClass()->FindFunctionByName(Function->GetFName());
		void* CallStackParams = ParamsBufferSize > 0 ? FMemory_Alloca(ParamsBufferSize) : nullptr;
	}

	void FFunctionWrapper::CallStatic(const std::vector<std::any>& Params, std::vector<std::any>& Outputs)
	{
		if (!DefaultBindObject)
		{
			DefaultBindObject = Function->GetOuterUClass()->GetDefaultObject();
		}

		Call(DefaultBindObject, Params, Outputs);
	}

}
