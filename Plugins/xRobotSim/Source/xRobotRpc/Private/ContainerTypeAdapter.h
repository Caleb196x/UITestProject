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
	FScriptArray Data;

	std::shared_ptr<FPropertyWrapper> ValueProperty;

	FORCEINLINE FScriptArrayExtension(FProperty* InProperty)
	{
		ValueProperty = FPropertyWrapper::Create(InProperty);
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
		return static_cast<uint8*>(Data.GetData() + Index * ElementSize);
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
		Destruct(0, Data.Num());
#if ENGINE_MAJOR_VERSION > 4
		Data.Empty(0, GetSizeWithAlignment(ValueProperty->GetProperty()),
			__STDCPP_DEFAULT_NEW_ALIGNMENT__);
#else
		Data.Empty(0, GetSizeWithAlignment(Property));
#endif
	}

};

struct FScriptSetExtension
{
	FScriptSet Data;
	
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
		return Data.GetScriptLayout(Property->GetSize(), Property->GetMinAlignment());
	}

	FORCEINLINE void Empty()
	{
		auto ScriptSetLayout = GetScriptSetLayout();
		Destruct(0, Data.Num());
		Data.Empty(0, ScriptSetLayout);
	}

	FORCEINLINE void Destruct(int32 Index, int32 Counts = 1)
	{
		auto ScriptSetLayout = GetScriptSetLayout();
		for (int32 i = Index; i < Counts; ++i)
		{
			void* Dest = Data.GetData(i, ScriptSetLayout);
			ValueProperty->DestroyValue(Dest);
		}
	}
};

struct FScriptMapExtension
{
	FScriptMap Data;

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
		return Data.GetScriptLayout(KeyProp->GetSize(), KeyProp->GetMinAlignment(),
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
			if (Data.IsValidIndex(i))
			{
				uint8* Dest = static_cast<uint8*>(Data.GetData(i, MapLayout));
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
		Destruct(0, Data.Num());
		Data.Empty(0, MapLayout);
	}
};


class FContainerTypeAdapter
{
public:
	using OperatorFunction = std::function<void(const std::vector<void*>&, )>;
	
	void* NewContainer(const FString& TypeName, FProperty* InValueProp, FProperty* InKeyProp = nullptr);

	template<typename ContainerType>
	void CallOperator(ContainerType* Container, const FString& OperatorName, const std::vector<void*>& Params)
	{
		
	}

	static TMap<FString, OperatorFunction> ArrayOperatorFunctions;
	static TMap<FString, OperatorFunction> SetOperatorFunctions;
	static TMap<FString, OperatorFunction> MapOperatorFunctions;
};

class FArrayContainerAdapter
{
public:
	static void Add();
};

class FSetContainerTypeAdapter
{
public:
	// 实现各类操作函数
	
};

class FMapContainerTypeAdapter
{
public:
	// 实现各类操作函数
};
