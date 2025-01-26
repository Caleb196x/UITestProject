#pragma once
#include <memory>

#include "FunctionWrapper.h"
#include "PropertyWrapper.h"

class FStructTypeAdapter
{
public:
	explicit FStructTypeAdapter(UStruct* InStruct) : Struct(InStruct)
	{
		Init();
	}

	virtual ~FStructTypeAdapter() {}
	
	// malloc a new object of this type
	virtual void* New(FString Name, uint64 ObjectFlags, std::vector<void*> ConstructArgs = {}) = 0;

	virtual FString GetMetaTypeName() = 0;

	std::shared_ptr<FFunctionWrapper> FindFunction(const FString& FuncName);

	std::shared_ptr<FPropertyWrapper> FindProperty(const FString& PropertyName);

	TWeakObjectPtr<UStruct> GetStruct() const { return Struct; }

protected:
	void CreateFunctionWrapper(UFunction* InFunction);
	void CreatePropertyWrapper(FProperty* InProperty);
	
	// 收集UStruct的类型信息，包括：
	// 静态函数Function，成员函数Method，成员变量Property，
	void Init();
	
	TWeakObjectPtr<UStruct> Struct;

	// 存放静态函数和成员函数
	TMap<FName, std::shared_ptr<FFunctionWrapper>> FunctionsMap;
	TMap<FName, std::shared_ptr<FPropertyWrapper>> PropertiesMap;
	TArray<std::shared_ptr<FPropertyWrapper>> Properties;
};

class FScriptStructTypeAdapter : public FStructTypeAdapter
{
public:
	explicit FScriptStructTypeAdapter(UScriptStruct* InScriptStruct) : FStructTypeAdapter(InScriptStruct) {}
	
	virtual void* New(FString Name, uint64 ObjectFlags, std::vector<void*> ConstructArgs={}) override;

	virtual FString GetMetaTypeName() override { return "UScriptStruct"; }

	virtual ~FScriptStructTypeAdapter() override {}

	static void* Alloc(UScriptStruct* InScriptStruct);
	
	static void Free(TWeakObjectPtr<UStruct> InStruct, void* InPtr);
};

class FClassTypeAdapter : public FStructTypeAdapter
{
public:
	explicit FClassTypeAdapter(UClass* InClass) : FStructTypeAdapter(InClass) {}
	
	virtual void* New(FString Name, uint64 ObjectFlags, std::vector<void*> ConstructArgs = {}) override;

	virtual FString GetMetaTypeName() override { return "UClass"; }

	virtual ~FClassTypeAdapter() override {}
};


