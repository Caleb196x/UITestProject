#pragma once
#include <functional>
#include <memory>

#include "CoreMinimal.h"
#include "CoreRpcUtils.h"
#include "PropertyWrapper.h"
#include "UnrealPythonRpcLog.h"


namespace UnrealPythonCore
{
FORCEINLINE int32  GetSizeWithAlignment(FProperty* InProperty)
{
	return Align(InProperty->GetSize(), InProperty->GetMinAlignment());
}
}

struct FScriptArrayExtension
{
	FScriptArray InnerArray;

	std::shared_ptr<FPropertyWrapper> ValueProperty;

	FORCEINLINE FScriptArrayExtension(FProperty* InProperty, int32 Counts = 1)
	{
		ValueProperty = FPropertyWrapper::Create(InProperty);
		Construct(Counts);
	}

	FORCEINLINE ~FScriptArrayExtension()
	{
		if (ValueProperty->IsPropertyValid())
		{
			Empty();
		}
		else
		{
			UE_LOG(LogUnrealPython, Error, TEXT("Failed to destroy ScriptArrayExtension, value propert is invalid"));
		}
	}

	FORCEINLINE uint8* GetData(int32 ElementSize, int32 Index)
	{
		return static_cast<uint8*>(InnerArray.GetData()) + Index * ElementSize;
	}

	FORCEINLINE void Construct(int32 Counts)
	{
		FProperty* Property = ValueProperty->GetProperty();
		const int32 ElementSize = GetSizeWithAlignment(Property);
		
#if ENGINE_MAJOR_VERSION > 4
		InnerArray.Add(Counts, ElementSize, __STDCPP_DEFAULT_NEW_ALIGNMENT__);
#else
		InnerArray.Add(Counts, ElementSize);
#endif
	}

	FORCEINLINE void Destruct(int32 Index, int32 Counts = 1)
	{
		const int32 ElementSize = GetSizeWithAlignment(ValueProperty->GetProperty());
		uint8* Dest = GetData(ElementSize, Index);
		for (int32 i = 0; i < Counts; ++i)
		{
			ValueProperty->DestroyValue(Dest);
			Dest += ElementSize;
		}
	}

	FORCEINLINE void Empty()
	{
		Destruct(0, InnerArray.Num());
#if ENGINE_MAJOR_VERSION > 4
		InnerArray.Empty(0, GetSizeWithAlignment(ValueProperty->GetProperty()),
			__STDCPP_DEFAULT_NEW_ALIGNMENT__);
#else
		Data.Empty(0, GetSizeWithAlignment(Property));
#endif
	}

};

struct FScriptSetExtension
{
	FScriptSet InnerSet;
	
	std::shared_ptr<FPropertyWrapper> ValueProperty;
	
	FORCEINLINE FScriptSetExtension(FProperty* InProperty)
	{
		ValueProperty = FPropertyWrapper::Create(InProperty);
	}

	FORCEINLINE ~FScriptSetExtension()
	{
		if (ValueProperty->IsPropertyValid())
		{
			Empty();
		}
		{
			UE_LOG(LogUnrealPython, Error, TEXT("Failed to destroy FScriptSetExtension, value propert is invalid"));
		}
	}

	FORCEINLINE FScriptSetLayout GetScriptSetLayout() const
	{
		FProperty* Property = ValueProperty->GetProperty();
		return InnerSet.GetScriptLayout(Property->GetSize(), Property->GetMinAlignment());
	}

	FORCEINLINE void Empty()
	{
		auto ScriptSetLayout = GetScriptSetLayout();
		Destruct(0, InnerSet.Num());
		InnerSet.Empty(0, ScriptSetLayout);
	}

	FORCEINLINE void Destruct(int32 Index, int32 Counts = 1)
	{
		auto ScriptSetLayout = GetScriptSetLayout();
		for (int32 i = Index; i < Counts; ++i)
		{
			void* Dest = InnerSet.GetData(i, ScriptSetLayout);
			ValueProperty->DestroyValue(Dest);
		}
	}
};

struct FScriptMapExtension
{
	FScriptMap InnerMap;

	std::shared_ptr<FPropertyWrapper> KeyProperty;

	std::shared_ptr<FPropertyWrapper> ValueProperty;

	FORCEINLINE FScriptMapExtension(FProperty* InKeyProperty, FProperty* InValueProperty)
	{
		KeyProperty = FPropertyWrapper::Create(InKeyProperty);
		ValueProperty = FPropertyWrapper::Create(InValueProperty);
	}

	FORCEINLINE ~FScriptMapExtension()
	{
		if (ValueProperty->IsPropertyValid() && KeyProperty->IsPropertyValid())
		{
			Empty();
		}
		else
		{
			UE_LOG(LogUnrealPython, Error, TEXT("Failed to destroy FScriptMapExtension, "
									   "value propert is invalid or key property is invalid"));
		}
	}

	FORCEINLINE FScriptMapLayout GetScriptMapLayout() const
	{
		FProperty* KeyProp = KeyProperty->GetProperty();
		FProperty* ValProp = ValueProperty->GetProperty();
		return InnerMap.GetScriptLayout(KeyProp->GetSize(), KeyProp->GetMinAlignment(),
									ValProp->GetSize(), ValProp->GetMinAlignment());
	}

	FORCEINLINE static int32 GetKeyOffset(const FScriptMapLayout& ScriptMapLayout)
	{
#if ENGINE_MINOR_VERSION < 22 && ENGINE_MAJOR_VERSION < 5
		return ScriptMapLayout.KeyOffset;
#else
		return 0;
#endif
	}

	FORCEINLINE void Destruct(int32 Index, int32 Count = 1)
	{
		auto MapLayout = GetScriptMapLayout();
		for (int32 i = Index; i < Count; ++i)
		{
			if (InnerMap.IsValidIndex(i))
			{
				uint8* Dest = static_cast<uint8*>(InnerMap.GetData(i, MapLayout));
				void* Key = Dest + GetKeyOffset(MapLayout);
				void* Val = Dest + MapLayout.ValueOffset;
				KeyProperty->DestroyValue(Key);
				ValueProperty->DestroyValue(Val);
			}
		}
	}

	FORCEINLINE void Empty()
	{
		auto MapLayout = GetScriptMapLayout();
		Destruct(0, InnerMap.Num());
		InnerMap.Empty(0, MapLayout);
	}
};

USTRUCT(noexport)
struct FPropertyMetaRoot
{
};

class FContainerElementTypePropertyManager
{
public:
	static FContainerElementTypePropertyManager& Get()
	{
		static FContainerElementTypePropertyManager Manager;
		return Manager;
	}
	
	FContainerElementTypePropertyManager()
	{
#if (ENGINE_MAJOR_VERSION == 5 && ENGINE_MINOR_VERSION >= 1) || ENGINE_MAJOR_VERSION > 5
		// fixme@Caleb196x: rename path
		PropertyMetaRoot = FindObject<UScriptStruct>(nullptr, TEXT("/Script/xRobotRpc.PropertyMetaRoot")); 
#else
		PropertyMetaRoot = FindObject<UScriptStruct>(ANY_PACKAGE, TEXT("PropertyMetaRoot"));
#endif

		Init();
	}
	
	~FContainerElementTypePropertyManager()
	{
		Deinit();
	}

	FProperty* GetPropertyFromTypeName(const FString& PropertyTypeName);
private:
	
	void Init();
	void Deinit() { /* do nothing */ }

	UScriptStruct* PropertyMetaRoot;
	TMap<FString, FProperty*> PropertiesCacheMap;
};


class FContainerTypeAdapter
{
public:
	using OperatorFunction = std::function<bool(void* ,const std::vector<void*>&,
		std::vector<std::pair<std::string /*rpc type*/, std::pair<std::string/*ue type*/, void*>>>&)>;
	
	static void* NewContainer(const FString& TypeName, FProperty* InValueProp, FProperty* InKeyProp = nullptr, int32 ArrayCounts = 1);

	static bool DestroyContainer(void* Container, const FString& TypeName);
	
	static bool CallOperator(void* Container, const FString& TypeName,  const FString& OperatorName, const std::vector<void*>& Params,
		std::vector<std::pair<std::string /*rpc type*/, std::pair<std::string/*ue type*/, void*>>>& Outputs, FString& OutErrMsg);

	static void Init();

	FORCEINLINE static void SetErrorMessage(const FString& Message) { CallOperatorErrorMessage = Message; }

	static TMap<FString, OperatorFunction> ArrayOperatorFunctions;
	static TMap<FString, OperatorFunction> SetOperatorFunctions;
	static TMap<FString, OperatorFunction> MapOperatorFunctions;

	static FString CallOperatorErrorMessage;
	static bool bIsInitialized;
};

#define DECLARE_CONTAINER_OPERATOR_FUNCTION(func) \
	static bool func(void* ,const std::vector<void*>&, \
			std::vector<std::pair<std::string /*rpc type*/, std::pair<std::string/*ue type*/, void*>>>&); \

class FArrayContainerAdapter
{
public:
	DECLARE_CONTAINER_OPERATOR_FUNCTION(Num)

	// Add(element1, element2, ...)
	// 
	DECLARE_CONTAINER_OPERATOR_FUNCTION(Add)
	DECLARE_CONTAINER_OPERATOR_FUNCTION(Get)
	DECLARE_CONTAINER_OPERATOR_FUNCTION(Set)
	DECLARE_CONTAINER_OPERATOR_FUNCTION(Contains)
	DECLARE_CONTAINER_OPERATOR_FUNCTION(FindIndex)
	DECLARE_CONTAINER_OPERATOR_FUNCTION(RemoveAt)
	DECLARE_CONTAINER_OPERATOR_FUNCTION(IsValidIndex)
	DECLARE_CONTAINER_OPERATOR_FUNCTION(Empty)

	
	FORCEINLINE static int32 AddUninitialized(FScriptArray* ScriptArray, int32 ElementSize, int32 Count)
	{
#if ENGINE_MAJOR_VERSION > 4
		return ScriptArray->Add(Count, ElementSize, __STDCPP_DEFAULT_NEW_ALIGNMENT__);
#else
		return ScriptArray->Add(Count, ElementSize);
#endif
	}
	
protected:
	static int32 FindIndexInternal(void* Container, const std::vector<void*>& InputParams);
};

class FSetContainerTypeAdapter
{
public:
	DECLARE_CONTAINER_OPERATOR_FUNCTION(Num)
	DECLARE_CONTAINER_OPERATOR_FUNCTION(Add)
	DECLARE_CONTAINER_OPERATOR_FUNCTION(Get)
	DECLARE_CONTAINER_OPERATOR_FUNCTION(Contains)
	DECLARE_CONTAINER_OPERATOR_FUNCTION(FindIndex)
	DECLARE_CONTAINER_OPERATOR_FUNCTION(RemoveAt)
	DECLARE_CONTAINER_OPERATOR_FUNCTION(GetMaxIndex)
	DECLARE_CONTAINER_OPERATOR_FUNCTION(IsValidIndex)
	DECLARE_CONTAINER_OPERATOR_FUNCTION(Empty)
};

class FMapContainerTypeAdapter
{
public:
	DECLARE_CONTAINER_OPERATOR_FUNCTION(Num)
	DECLARE_CONTAINER_OPERATOR_FUNCTION(Add)
	DECLARE_CONTAINER_OPERATOR_FUNCTION(Get)
	DECLARE_CONTAINER_OPERATOR_FUNCTION(Set)
	DECLARE_CONTAINER_OPERATOR_FUNCTION(Remove)
	DECLARE_CONTAINER_OPERATOR_FUNCTION(GetMaxIndex)
	DECLARE_CONTAINER_OPERATOR_FUNCTION(IsValidIndex)
	DECLARE_CONTAINER_OPERATOR_FUNCTION(GetKey)
	DECLARE_CONTAINER_OPERATOR_FUNCTION(Empty)
};
