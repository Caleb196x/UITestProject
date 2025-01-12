#include "StructTypeContainer.h"
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

std::shared_ptr<FFunctionWrapper> FStructTypeContainer::FindFunction(const FString& FuncName)
{
	const FName Name = FName(*FuncName);
	if (!FunctionsMap.Contains(Name))
	{
		return nullptr;
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
			Properties.Add(PropertyWrapper);
		}
	}
}

void* FScriptStructTypeContainer::New(FString Name, uint64 ObjectFlags, TArray<void*> ConstructArgs)
{
	void* Memory = Alloc(static_cast<UScriptStruct*>(Struct.Get()));
	const int Count = ConstructArgs.Num() < Properties.Num() ? ConstructArgs.Num() : Properties.Num();
	for (int i = 0; i < Count; ++i)
	{
		Properties[i]->CopyToUeValueInContainer(ConstructArgs[i], Memory);
	}

	return Memory;
}

void* FScriptStructTypeContainer::Alloc(UScriptStruct* InScriptStruct)
{
	void* ScriptStructMemory = new char[InScriptStruct->GetStructureSize()];
	InScriptStruct->InitializeStruct(ScriptStructMemory);
	return ScriptStructMemory;
}

void FScriptStructTypeContainer::Free(TWeakObjectPtr<UStruct> InStruct, void* InPtr)
{
	if (InStruct.IsValid())
		InStruct->DestroyStruct(InPtr);
	delete[] static_cast<char*>(InPtr);
}

void* FClassTypeContainer::New(FString Name, uint64 ObjectFlags, TArray<void*> ConstructArgs)
{
	UClass* Class = static_cast<UClass*>(Struct.Get());
	UObject* Outer = GetTransientPackage();
	FName ClassName = FName(*Name);
	EObjectFlags Flags = static_cast<EObjectFlags>(ObjectFlags);
	UObject* ObjPtr = NewObject<UObject>(Outer, Class, ClassName, Flags);
	return static_cast<void*>(ObjPtr);
}


