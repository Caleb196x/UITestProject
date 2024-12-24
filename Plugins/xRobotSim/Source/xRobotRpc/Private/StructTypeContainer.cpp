#include "StructTypeContainer.h"

#include "RpcException.h"

namespace xRobotRpc
{
	void FStructTypeContainer::Init()
	{
		// TODO: process native cpp type
		
		for (TFieldIterator<FProperty> PropIter(Struct.Get(), EFieldIteratorFlags::ExcludeSuper); PropIter; ++PropIter)
		{
			CreatePropertyWrapper(*PropIter);
		}

		// 只有UClass才存在方法
		if (const UClass* Class = Cast<UClass>(Struct.Get()))
		{
			for (TFieldIterator<UFunction> FuncIter(Class, EFieldIteratorFlags::ExcludeSuper); FuncIter; ++FuncIter)
			{
				CreateFunctionWrapper(*FuncIter);
			}
		}
	}

	UObject* FStructTypeContainer::New(FString Name, EObjectFlags ObjectFlags)
	{
		ThrowRuntimeRpcException("Can not create UStruct directly, please create UScriptClass or UClass");
	}

	std::shared_ptr<FFunctionWrapper> FStructTypeContainer::FindFunction(FString FuncName)
	{
		FName Name = FName(*FuncName);
		if (!FunctionsMap.Contains(Name))
		{
			ThrowRuntimeRpcException(FString::Printf(TEXT("Not exist function: %s"), *FuncName));
		}

		return FunctionsMap.FindChecked(Name);
	}

	void FStructTypeContainer::CreateFunctionWrapper(UFunction* InFunction)
	{
		FName FuncName = InFunction->GetFName();
		if (!FunctionsMap.Contains(FuncName))
		{
			const std::shared_ptr<FFunctionWrapper> FunctionWrapper = std::make_shared<FFunctionWrapper>(InFunction);
			FunctionsMap.Add(FuncName, FunctionWrapper);
		}
	}

	void FStructTypeContainer::CreatePropertyWrapper(FProperty* InProperty)
	{
		FName PropName = InProperty->GetFName();
		if (!PropertiesMap.Contains(PropName))
		{
			const std::shared_ptr<FPropertyWrapper> PropertyWrapper = std::make_shared<FPropertyWrapper>(InProperty);
			PropertiesMap.Add(PropName, PropertyWrapper);
		}
	}

}
