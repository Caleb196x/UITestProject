#include "StructTypeContainer.h"

#include "RpcException.h"
#include "UnrealPythonRpcLog.h"

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

UObject* FStructTypeContainer::New(FString Name, uint64 ObjectFlags)
{
	UClass* Class = static_cast<UClass*>(Struct.Get());
	UObject* Outer = GetTransientPackage();
	FName ClassName = FName(*Name);
	EObjectFlags Flags = static_cast<EObjectFlags>(ObjectFlags);
	return NewObject<UObject>(Outer, Class, ClassName, Flags);
}

std::shared_ptr<FFunctionWrapper> FStructTypeContainer::FindFunction(const FString& FuncName)
{
	const FName Name = FName(*FuncName);
	if (!FunctionsMap.Contains(Name))
	{
		ThrowRuntimeRpcException(FString::Printf(TEXT("Not exist function: %s"), *FuncName));
	}

	return FunctionsMap.FindChecked(Name);
}

std::shared_ptr<FPropertyWrapper> FStructTypeContainer::FindProperty(const FString& PropertyName)
{
	const FName Name = FName(*PropertyName);
	if (!PropertiesMap.Contains(Name))
	{
		UE_LOG(LogUnrealPython, Error, TEXT("Not found any property %s"), *PropertyName)
		return nullptr;
	}

	return PropertiesMap.FindChecked(Name);
}

void FStructTypeContainer::CreateFunctionWrapper(UFunction* InFunction)
{
	const FName FuncName = InFunction->GetFName();
	if (!FunctionsMap.Contains(FuncName))
	{
		const std::shared_ptr<FFunctionWrapper> FunctionWrapper = std::make_shared<FFunctionWrapper>(InFunction);
		FunctionsMap.Add(FuncName, FunctionWrapper);
	}
}

void FStructTypeContainer::CreatePropertyWrapper(FProperty* InProperty)
{
	const FName PropName = InProperty->GetFName();
	if (!PropertiesMap.Contains(PropName))
	{
		if (const std::shared_ptr<FPropertyWrapper> PropertyWrapper = FPropertyWrapper::Create(InProperty))
		{
			PropertiesMap.Add(PropName, PropertyWrapper);
		}
	}
}

/*UObject* FScriptStructTypeContainer::New(FString Name, uint64 ObjectFlags)
{
	
}

UObject* FClassTypeContainer::New(FString Name, uint64 ObjectFlags)
{

}*/

