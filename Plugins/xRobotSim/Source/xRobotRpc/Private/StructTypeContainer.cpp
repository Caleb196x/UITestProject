#include "StructTypeContainer.h"

#include "RpcException.h"

namespace xRobotRpc
{
	void FStructTypeContainer::Init()
	{
		// TODO: process native cpp type

		// TODO: process properties

		// 只有UClass才存在方法
		if (const UClass* Class = Cast<UClass>(Struct.Get()))
		{
			for (TFieldIterator<UFunction> FuncIter(Class, EFieldIteratorFlags::ExcludeSuper); FuncIter; ++FuncIter)
			{
				UFunction* Function = *FuncIter;
				FName FuncName = Function->GetFName();
				// 判断是否已经在FunctionsMap已经存在
				if (!FunctionsMap.Contains(FuncName))
				{
					continue;
				}
				
				CreateFunctionWrapper(*FuncIter);
			}
			
		}
	}

	UObject* FStructTypeContainer::New(FString Name, EObjectFlags ObjectFlags)
	{
		return nullptr;
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
