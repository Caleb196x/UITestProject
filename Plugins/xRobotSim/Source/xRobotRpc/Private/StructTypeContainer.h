#pragma once
#include <memory>

#include "FunctionWrapper.h"
#include "PropertyWrapper.h"

class FStructTypeContainer
{
public:
	explicit FStructTypeContainer(UStruct* InStruct) : Struct(InStruct)
	{
		Init();
	}

	virtual ~FStructTypeContainer() {}
	
	// malloc a new object of this type
	virtual UObject* New(FString Name, uint64 ObjectFlags);

	std::shared_ptr<FFunctionWrapper> FindFunction(const FString& FuncName);

	std::shared_ptr<FPropertyWrapper> FindProperty(const FString& PropertyName);

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
};

/*class FScriptStructTypeContainer : public FStructTypeContainer
{
public:
	virtual UObject* New(FString Name, uint64 ObjectFlags) override;

	virtual ~FScriptStructTypeContainer() {}

	static void* Alloc(UScriptStruct* InScriptStruct);

	static void Free(TWeakObjectPtr<UStruct> InStruct, void* InPtr);
};

class FClassTypeContainer : public FStructTypeContainer
{
public:
	virtual UObject* New(FString Name, uint64 ObjectFlags) override;

	virtual ~FClassTypeContainer() {}
};*/


