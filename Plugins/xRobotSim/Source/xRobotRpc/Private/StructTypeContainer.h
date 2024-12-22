#pragma once
#include <memory>

#include "FunctionWrapper.h"
#include "PropertyWrapper.h"

namespace xRobotRpc
{
	class FStructTypeContainer
	{
	public:
		explicit FStructTypeContainer(UStruct* InStruct) : Struct(InStruct)
		{
			Init();
		}

		virtual ~FStructTypeContainer() {}
		
		// malloc a new object of this type
		virtual UObject* New(FString Name, EObjectFlags ObjectFlags);

		std::shared_ptr<FFunctionWrapper> FindFunction(FString FuncName);

	protected:
		void CreateFunctionWrapper(UFunction* InFunction);
		void CreatePropertyWrapper(FProperty* InProperty);
		
	private:
		// 收集UStruct的类型信息，包括：
		// 静态函数Function，成员函数Method，成员变量Property，
		void Init();
		
		TWeakObjectPtr<UStruct> Struct;

		// 存放静态函数和成员函数
		TMap<FName, std::shared_ptr<FFunctionWrapper>> FunctionsMap;
		TMap<FName, std::shared_ptr<FPropertyWrapper>> PropertiesMap;
	};

	class FScriptStructTypeContainer : public FStructTypeContainer
	{
	public:
		
	};

	class FClassTypeContainer : public FStructTypeContainer
	{
	public:
		
	};
}

