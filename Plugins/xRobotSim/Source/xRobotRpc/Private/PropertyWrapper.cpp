#include "PropertyWrapper.h"

#include "CoreRpcUtils.h"
#include "RpcException.h"
#include "UnrealPythonRpcLog.h"
#include "UnrealPythonRpcUtils.h"

#define CATCH_ANY_CAST_EXCEPTION(Code, Type) \
		try				\
		{				\
			Code		\
			return true; \
		}				\
		catch (const std::bad_any_cast& e)	\
		{									\
			const FString What = UTF8_TO_TCHAR(e.what()); \
			UE_LOG(LogUnrealPython, Error, TEXT("Failed to cast std::any Invalue to Type %s, check the input parameter. exception: %s"), *What, Type); \
			return false; \
		} \

#define TRY_CAST_WHEN_ANY_CAST_FAILED(Code, TryCode, Type) \
		try				\
		{				\
			Code		\
			return true; \
		}				\
		catch (const std::bad_any_cast& e)	\
		{									\
			try { \
				TryCode \
			} \
			catch(const std::bad_any_cast& e) \
			{					\
				const FString What = UTF8_TO_TCHAR(e.what()); \
				UE_LOG(LogUnrealPython, Error, TEXT("Failed to cast std::any Invalue to Type %s, check the input parameter. exception: %s"), *What, Type); \
				return false; \
			}					\
		} \

#define CHECK_PTR(Ptr, PropertyName) \
	if (Ptr == nullptr) \
	{	\
		const FString PtrName = UTF8_TO_TCHAR(#Ptr); \
		const FString PropName = UTF8_TO_TCHAR(#PropertyName); \
		UE_LOG(LogUnrealPython, Error, TEXT("Failed to change property %s, the ptr %s is null"), *PtrName, *PropName); \
		return false; \
	}	\

void* FPropertyWrapper::Getter(UObject* Owner)
{
	if (FCoreUtils::IsReleasePtr(Owner))
	{
		return nullptr;
	}

	auto ValSize = Property->GetSize();
	void* OutValue = FMemory::Malloc(ValSize);
	FMemory::Memzero(OutValue, ValSize);
	if (!ReadUeValueInContainer(Owner, OutValue))
	{
		return nullptr;
	}

	return OutValue;
}

void FPropertyWrapper::Setter(UObject* Owner, const void* InValue)
{
	if (FCoreUtils::IsReleasePtr(Owner))
	{
		return;
	}

	if (!CopyToUeValueInContainer(InValue, Owner))
	{
		UE_LOG(LogUnrealPython, Error, TEXT("Set value to property %s failed"), *Property->GetName())
	}
}

class FInt32PropertyWrapper : public FPropertyWrapper
{
public:
	explicit FInt32PropertyWrapper(FProperty* InProperty) : FPropertyWrapper(InProperty) {}

	virtual bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const override
	{
		CHECK_PTR(DestValuePtr, FInt32PropertyWrapper)
		CHECK_PTR(SrcValuePtr, FInt32PropertyWrapper)
		
		const int32* Src = static_cast<const int32*>(SrcValuePtr);
		const int32 Val = *Src;
		NumericProperty->SetIntPropertyValue(DestValuePtr, static_cast<uint64>(Val));
		return true;
	}

	virtual bool ReadUeValue(const void* UeValuePtr, void* OutValue) const override
	{
		CHECK_PTR(UeValuePtr, FInt32PropertyWrapper)
		CHECK_PTR(OutValue, FInt32PropertyWrapper)
		
		const int32 Value = static_cast<int32>(NumericProperty->GetSignedIntPropertyValue(UeValuePtr));
		int32* Dest = static_cast<int32*>(OutValue);
		*Dest = Value;
		return true;
	}
};

class FUInt32PropertyWrapper : public FPropertyWrapper
{
public:
	explicit FUInt32PropertyWrapper(FProperty* InProperty) : FPropertyWrapper(InProperty) { }

	// 仿照FInt32PropertyWrapper类编写CopyToUeValue和ReadUeValue函数
	virtual bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const override
	{
		CHECK_PTR(DestValuePtr, FUInt32PropertyWrapper)
		CHECK_PTR(SrcValuePtr, FUInt32PropertyWrapper)
		
		const uint32* Src = static_cast<const uint32*>(SrcValuePtr);
		const uint32 Val = *Src;
		NumericProperty->SetIntPropertyValue(DestValuePtr, static_cast<uint64>(Val));
		return true;
	}
	
	virtual bool ReadUeValue(const void* UeValuePtr, void* OutValue) const override
	{
		CHECK_PTR(UeValuePtr, FUInt32PropertyWrapper)
		CHECK_PTR(OutValue, FUInt32PropertyWrapper)
		
		const uint32 Value = static_cast<uint32>(NumericProperty->GetUnsignedIntPropertyValue(UeValuePtr));
		uint32* Dest = static_cast<uint32*>(OutValue);
		*Dest = Value;
		return true;
	}
};

class FInt64PropertyWrapper : public FPropertyWrapper
{
public:
	explicit FInt64PropertyWrapper(FProperty* InProperty) : FPropertyWrapper(InProperty) { }
	
	virtual bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const override
	{
		CHECK_PTR(DestValuePtr, FInt64PropertyWrapper)
		CHECK_PTR(SrcValuePtr, FInt64PropertyWrapper)
		
		const int64* Src = static_cast<const int64*>(SrcValuePtr);
		const int64 Val = *Src;
		NumericProperty->SetIntPropertyValue(DestValuePtr, static_cast<int64>(Val));
		return true;
	}
	
	virtual bool ReadUeValue(const void* UeValuePtr, void* OutValue) const override
	{
		CHECK_PTR(UeValuePtr, FInt64PropertyWrapper)
		CHECK_PTR(OutValue, FInt64PropertyWrapper)
		
		const int64 Value = NumericProperty->GetSignedIntPropertyValue(UeValuePtr);
		int64* Dest = static_cast<int64*>(OutValue);
		*Dest = Value;
		return true;
	}
};

class FUInt64PropertyWrapper : public FPropertyWrapper
{
public:
	explicit FUInt64PropertyWrapper(FProperty* InProperty) : FPropertyWrapper(InProperty) { }

	virtual bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const override
	{
		CHECK_PTR(DestValuePtr, FUInt64PropertyWrapper)
		CHECK_PTR(SrcValuePtr, FUInt64PropertyWrapper)
		
		const uint64* Src = static_cast<const uint64*>(SrcValuePtr);
		
		const uint64 Val = *Src;
		NumericProperty->SetIntPropertyValue(DestValuePtr, static_cast<int64>(Val));
		return true;
	}
	
	virtual bool ReadUeValue(const void* UeValuePtr, void* OutValue) const override
	{
		CHECK_PTR(UeValuePtr, FUInt64PropertyWrapper)
		CHECK_PTR(OutValue, FUInt64PropertyWrapper)
		
		const uint64 Value = static_cast<uint64>(NumericProperty->GetUnsignedIntPropertyValue(UeValuePtr));
		uint64* Dest = static_cast<uint64*>(OutValue);
		*Dest = Value;
		return true;
	}
};

class FNumberPropertyWrapper : public FPropertyWrapper
{
public:
	explicit FNumberPropertyWrapper(FProperty* InProperty) : FPropertyWrapper(InProperty) { }

	virtual bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const override
	{
		CHECK_PTR(DestValuePtr, FNumberPropertyWrapper)
		CHECK_PTR(SrcValuePtr, FNumberPropertyWrapper)
		
		const double* Src = static_cast<const double*>(SrcValuePtr);
		
		const double Val = *Src;
		NumericProperty->SetFloatingPointPropertyValue(DestValuePtr, Val);
		return true;
	}
	
	virtual bool ReadUeValue(const void* UeValuePtr, void* OutValue) const override
	{
		CHECK_PTR(UeValuePtr, FNumberPropertyWrapper)
		CHECK_PTR(OutValue, FNumberPropertyWrapper)
		
		const double Value = NumericProperty->GetFloatingPointPropertyValue(UeValuePtr);
		double* Dest = static_cast<double*>(OutValue);
		*Dest = Value;
		return true;
	}
	
};

class FBooleanPropertyWrapper : public FPropertyWrapper
{
public:
	explicit FBooleanPropertyWrapper(FProperty* InProperty) : FPropertyWrapper(InProperty) { }

	virtual bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const override
	{
		CHECK_PTR(DestValuePtr, FBooleanPropertyWrapper)
		CHECK_PTR(SrcValuePtr, FBooleanPropertyWrapper)
		
		const bool* Src = static_cast<const bool*>(SrcValuePtr);
		const bool Val = *Src;
		BoolProperty->SetPropertyValue(DestValuePtr, Val);
		return true;
	}
	
	virtual bool ReadUeValue(const void* UeValuePtr, void* OutValue) const override
	{
		CHECK_PTR(UeValuePtr, FBooleanPropertyWrapper)
		CHECK_PTR(OutValue, FBooleanPropertyWrapper)
		
		const bool Value = BoolProperty->GetPropertyValue(UeValuePtr);
		bool* Dest = static_cast<bool*>(OutValue);
		*Dest = Value;
		return true;
	}
};

class FEnumPropertyWrapper : public FPropertyWrapper
{
public:
	explicit FEnumPropertyWrapper(FProperty* InProperty) : FPropertyWrapper(InProperty) { }

	virtual bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const override
	{
		CHECK_PTR(DestValuePtr, FEnumPropertyWrapper)
		CHECK_PTR(SrcValuePtr, FEnumPropertyWrapper)
		
		const int32* Src = static_cast<const int32*>(SrcValuePtr);
		const int32 Val = *Src;
		EnumProperty->GetUnderlyingProperty()->SetIntPropertyValue(DestValuePtr, static_cast<uint64>(Val));
		return true;
	}
	
	virtual bool ReadUeValue(const void* UeValuePtr, void* OutValue) const override
	{
		CHECK_PTR(UeValuePtr, FEnumPropertyWrapper)
		CHECK_PTR(OutValue, FEnumPropertyWrapper)
		
		const int32 Value = static_cast<int32>(EnumProperty->GetUnderlyingProperty()->GetSignedIntPropertyValue(UeValuePtr));
		int32* Dest = static_cast<int32*>(OutValue);
		*Dest = Value;
		return true;
	}
};


class FPropertyWrapperWithDestructor : public FPropertyWrapper
{
public:
	explicit FPropertyWrapperWithDestructor(FProperty* InProperty) : FPropertyWrapper(InProperty) {}

	virtual void Cleanup(void* ContainerPtr) const override
	{
		Property->DestroyValue_InContainer(ContainerPtr);
	}
};

class FStringPropertyWrapper : public FPropertyWrapperWithDestructor
{
public:
	explicit FStringPropertyWrapper(FProperty* InProperty) : FPropertyWrapperWithDestructor(InProperty) {}

	virtual bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const override
	{
		CHECK_PTR(DestValuePtr, FStringPropertyWrapper)
		CHECK_PTR(SrcValuePtr, FStringPropertyWrapper)
		
		const FString* Src = static_cast<const FString*>(SrcValuePtr);
		StrProperty->SetPropertyValue(DestValuePtr, *Src);
		return true;
	}

	virtual bool ReadUeValue(const void* UeValuePtr, void* OutValue) const override
	{
		CHECK_PTR(UeValuePtr, FStringPropertyWrapper)
		CHECK_PTR(OutValue, FStringPropertyWrapper)
		
		const FString Value = StrProperty->GetPropertyValue(UeValuePtr);
		FString* Dest = static_cast<FString*>(OutValue);
		*Dest = Value;
		return true;
	}
};

class FNamePropertyWrapper : public FPropertyWrapperWithDestructor
{
public:
	explicit FNamePropertyWrapper(FProperty* InProperty) : FPropertyWrapperWithDestructor(InProperty) {}

	virtual bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const override
	{
		CHECK_PTR(DestValuePtr, FNamePropertyWrapper)
		CHECK_PTR(SrcValuePtr, FNamePropertyWrapper)
		
		const FString* Src = static_cast<const FString*>(SrcValuePtr);
		const FName NameVal = FName(**Src);
		NameProperty->SetPropertyValue(DestValuePtr, NameVal);
		return true;
	}

	virtual bool ReadUeValue(const void* UeValuePtr, void* OutValue) const override
	{
		CHECK_PTR(UeValuePtr, FNamePropertyWrapper)
		CHECK_PTR(OutValue, FNamePropertyWrapper)
		
		const FName Value = NameProperty->GetPropertyValue(UeValuePtr);
		FString* Dest = static_cast<FString*>(OutValue);
		*Dest = Value.ToString();
		return true;
	}
};

class FTextPropertyWrapper : public FPropertyWrapperWithDestructor
{
public:
	explicit FTextPropertyWrapper(FProperty* InProperty) : FPropertyWrapperWithDestructor(InProperty) {}
	virtual bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const override
	{
		CHECK_PTR(DestValuePtr, FTextPropertyWrapper)
		CHECK_PTR(SrcValuePtr, FTextPropertyWrapper)
		
		const FString* Src = static_cast<const FString*>(SrcValuePtr);
		const FText TextVal = FText::FromString(*Src);
		TextProperty->SetPropertyValue(DestValuePtr, TextVal);
		return true;
	}

	virtual bool ReadUeValue(const void* UeValuePtr, void* OutValue) const override
	{
		CHECK_PTR(UeValuePtr, FTextPropertyWrapper)
		CHECK_PTR(OutValue, FTextPropertyWrapper)
		
		const FText Value = TextProperty->GetPropertyValue(UeValuePtr);
		FString* Dest = static_cast<FString*>(OutValue);
		*Dest = Value.ToString();
		return true;
	}
};

class FObjectPropertyWrapper : public FPropertyWrapperWithDestructor
{
public:
	explicit FObjectPropertyWrapper(FProperty* InProperty) : FPropertyWrapperWithDestructor(InProperty) {}

	virtual bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const override
	{
		CHECK_PTR(DestValuePtr, FObjectPropertyWrapper)
		CHECK_PTR(SrcValuePtr, FObjectPropertyWrapper)
		
		void* Src = const_cast<void*>(SrcValuePtr);
		UObject* Object = static_cast<UObject*>(Src);
		ObjectBaseProperty->SetObjectPropertyValue(DestValuePtr, Object);
		return true;
	}

	virtual bool ReadUeValue(const void* UeValuePtr, void* OutValue) const override
	{
		CHECK_PTR(UeValuePtr, FObjectPropertyWrapper)
		CHECK_PTR(OutValue, FObjectPropertyWrapper)
		
		UObject* Value = ObjectBaseProperty->GetObjectPropertyValue(UeValuePtr);
		UObject** Dest = static_cast<UObject**>(OutValue);
		*Dest = Value;
		return true;
	}
};

class FSoftObjectPropertyWrapper : public FPropertyWrapperWithDestructor
{
public:
	explicit FSoftObjectPropertyWrapper(FProperty* InProperty) : FPropertyWrapperWithDestructor(InProperty) {}


	virtual bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const override
	{
		CHECK_PTR(DestValuePtr, FSoftObjectPropertyWrapper)
		CHECK_PTR(SrcValuePtr, FSoftObjectPropertyWrapper)
		
		const FSoftObjectPtr* Ptr = static_cast<const FSoftObjectPtr*>(SrcValuePtr);
		if (!Ptr)
		{
			return false;
		}

		SoftObjectProperty->SetPropertyValue(DestValuePtr, *Ptr);
		return true;
	}

	virtual bool ReadUeValue(const void* UeValuePtr, void* OutValue) const override
	{
		CHECK_PTR(UeValuePtr, FSoftObjectPropertyWrapper)
		CHECK_PTR(OutValue, FSoftObjectPropertyWrapper)
		
		const FSoftObjectPtr* Value = SoftObjectProperty->GetPropertyValuePtr(UeValuePtr);
		const FSoftObjectPtr** Dest = static_cast<const FSoftObjectPtr**>(OutValue);
		*Dest = Value;
		return true;
	}
};

class FClassPropertyWrapper : public FPropertyWrapperWithDestructor
{
public:
	explicit FClassPropertyWrapper(FProperty* InProperty) : FPropertyWrapperWithDestructor(InProperty) {}

	virtual bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const override
	{
		CHECK_PTR(DestValuePtr, FClassPropertyWrapper)
		CHECK_PTR(SrcValuePtr, FClassPropertyWrapper)
		
		void* SrcWithOutConst = const_cast<void*>(SrcValuePtr);
		UObject* Src = static_cast<UObject*>(SrcWithOutConst);
		if (FCoreUtils::IsReleasePtr(Src))
		{
			return false;
		}

		UClass* Class = Cast<UClass>(Src);
		ObjectBaseProperty->SetObjectPropertyValue(DestValuePtr, 
			(Class && Class->IsChildOf(ClassProperty->MetaClass)) ? Class : nullptr);
		return true;
	}

	bool ReadUeValue(const void* UeValuePtr, void* OutValue) const override
	{
		return true;
	}
};

class FSoftClassPropertyWrapper : public FPropertyWrapperWithDestructor
{
public:
	explicit FSoftClassPropertyWrapper(FProperty* InProperty) : FPropertyWrapperWithDestructor(InProperty) {}

	virtual bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const override
	{
		CHECK_PTR(DestValuePtr, FSoftClassPropertyWrapper)
		CHECK_PTR(SrcValuePtr, FSoftClassPropertyWrapper)
		
		const FSoftObjectPtr* Ptr = static_cast<const FSoftObjectPtr*>(SrcValuePtr);
		if (!Ptr)
		{
			return false;
		}

		SoftClassProperty->SetPropertyValue(DestValuePtr, *Ptr);
		return true;
	}

	virtual bool ReadUeValue(const void* UeValuePtr, void* OutValue) const override
	{
		CHECK_PTR(UeValuePtr, FSoftClassPropertyWrapper)
		CHECK_PTR(OutValue, FSoftClassPropertyWrapper)
		
		const FSoftObjectPtr* Value = SoftClassProperty->GetPropertyValuePtr(UeValuePtr);
		const FSoftObjectPtr** Dest = static_cast<const FSoftObjectPtr**>(OutValue);
		*Dest = Value;
		return true;
	}
};

class FInterfacePropertyWrapper : public FPropertyWrapperWithDestructor
{
public:
	explicit FInterfacePropertyWrapper(FProperty* InProperty) : FPropertyWrapperWithDestructor(InProperty) {}

	virtual bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const override
	{
		CHECK_PTR(DestValuePtr, FInterfacePropertyWrapper)
		CHECK_PTR(SrcValuePtr, FInterfacePropertyWrapper)

		void* SrcWithoutConst = const_cast<void*>(SrcValuePtr);
		UObject* Src = static_cast<UObject*>(SrcWithoutConst);
		if (FCoreUtils::IsReleasePtr(Src))
		{
			return false;
		}

		FScriptInterface* Interface = reinterpret_cast<FScriptInterface*>(Src);
		Interface->SetObject(Src);
		Interface->SetInterface(Src ? Src->GetInterfaceAddress(InterfaceProperty->InterfaceClass) : nullptr);
		return true;
	}

	virtual bool ReadUeValue(const void* UeValuePtr, void* OutValue) const override
	{
		CHECK_PTR(UeValuePtr, FInterfacePropertyWrapper)
		CHECK_PTR(OutValue, FInterfacePropertyWrapper)
		
		const FScriptInterface* Value = InterfaceProperty->GetPropertyValuePtr(UeValuePtr);
		UObject* Object = Value->GetObject();
		if (FCoreUtils::IsReleasePtr(Object))
		{
			return false;
		}

		UObject** Dest = static_cast<UObject**>(OutValue);
		*Dest = Object;
		return true;
	}
};


#if ENGINE_MINOR_VERSION >= 23 || ENGINE_MAJOR_VERSION > 4
class FFieldPathPropertyWrapper : public FPropertyWrapperWithDestructor
{
public:
	explicit FFieldPathPropertyWrapper(FProperty* InProperty) : FPropertyWrapperWithDestructor(InProperty) {}

	virtual bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const override
	{
		CHECK_PTR(DestValuePtr, FFieldPathPropertyWrapper)
		CHECK_PTR(SrcValuePtr, FFieldPathPropertyWrapper)
		
		const FString* Src = static_cast<const FString*>(SrcValuePtr);

		FFieldPath FieldPath;
        FieldPath.Generate(*(*Src));
		
		if (!FieldPath.GetTyped(FieldPathProperty->PropertyClass))
		{
			UE_LOG(LogUnrealPython, Error, TEXT("invalid FieldPath: %s"), *(*Src));
			return false;
		}
		
		FieldPathProperty->SetPropertyValue(DestValuePtr, FieldPath);
		return true;
	}

	virtual bool ReadUeValue(const void* UeValuePtr, void* OutValue) const override
	{
		CHECK_PTR(UeValuePtr, FFieldPathPropertyWrapper)
		CHECK_PTR(OutValue, FFieldPathPropertyWrapper)
		
		const FString Value = FieldPathProperty->GetPropertyValue(UeValuePtr).ToString();
		FString* Dest = static_cast<FString*>(OutValue);
		*Dest = Value;
		return true;
	}
};

#endif

class FFastPropertyWrapper : public FPropertyWrapperWithDestructor
{
public:
	explicit FFastPropertyWrapper(FProperty* InProperty) : FPropertyWrapperWithDestructor(InProperty) {}
};

class FScriptStructPropertyWrapper : public FFastPropertyWrapper
{
public:
	explicit FScriptStructPropertyWrapper(FProperty* InProperty) : FFastPropertyWrapper(InProperty) {}

	virtual bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const override
	{
		CHECK_PTR(DestValuePtr, FScriptStructPropertyWrapper)
		CHECK_PTR(SrcValuePtr, FScriptStructPropertyWrapper)

		const UScriptStruct* ScriptStruct = StructProperty->Struct;
		if (!ScriptStruct)
		{
			UE_LOG(LogUnrealPython, Error, TEXT("Invalid script struct"));
			return false;	
		}

		ScriptStruct->CopyScriptStruct(DestValuePtr, SrcValuePtr);
		return true;
	}

	virtual bool ReadUeValue(const void* UeValuePtr, void* OutValue) const override
	{
		CHECK_PTR(UeValuePtr, FScriptStructPropertyWrapper)
		CHECK_PTR(OutValue, FScriptStructPropertyWrapper)

		const UScriptStruct* ScriptStruct = StructProperty->Struct;
		if (!ScriptStruct)
		{
			UE_LOG(LogUnrealPython, Error, TEXT("Invalid script struct"));
			return false;
		}

		ScriptStruct->CopyScriptStruct(OutValue, UeValuePtr);
		return true;
	}
};

class FScriptArrayPropertyWrapper : public FFastPropertyWrapper
{
public:
	explicit FScriptArrayPropertyWrapper(FProperty* InProperty) : FFastPropertyWrapper(InProperty) {}

	virtual bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const override
	{
		CHECK_PTR(DestValuePtr, FScriptArrayPropertyWrapper)
		CHECK_PTR(SrcValuePtr, FScriptArrayPropertyWrapper)

		FScriptArray* DestArray = static_cast<FScriptArray*>(DestValuePtr);
		const FScriptArray* SrcArray = static_cast<const FScriptArray*>(SrcValuePtr);

		if (!ArrayProperty->Inner)
		{
			UE_LOG(LogUnrealPython, Error, TEXT("Invalid array inner property"));
			return false;
		}
		ArrayProperty->CopyCompleteValue(DestArray, SrcArray);
		/*
		const int32 Count = SrcArray->Num();
		DestArray->Empty(Count, ArrayProperty->Inner->ElementSize, DEFAULT_ALIGNMENT);
		DestArray->Add(Count, ArrayProperty->Inner->ElementSize, DEFAULT_ALIGNMENT);

		for (int32 i = 0; i < Count; ++i)
		{
			ArrayProperty->Inner->CopyCompleteValue(
				static_cast<uint8*>(DestArray->GetData()) + i * ArrayProperty->Inner->ElementSize,
				static_cast<uint8*>(SrcArray->GetData()) + i * ArrayProperty->Inner->ElementSize
			);
		}
		*/

		return true;
	}

	virtual bool ReadUeValue(const void* UeValuePtr, void* OutValue) const override
	{
		CHECK_PTR(UeValuePtr, FScriptArrayPropertyWrapper)
		CHECK_PTR(OutValue, FScriptArrayPropertyWrapper)

		const FScriptArray* SrcArray = static_cast<const FScriptArray*>(UeValuePtr);
		FScriptArray* DestArray = static_cast<FScriptArray*>(OutValue);

		if (!ArrayProperty->Inner)
		{
			UE_LOG(LogUnrealPython, Error, TEXT("Invalid array inner property"));
			return false;
		}

		ArrayProperty->CopyCompleteValue(DestArray, SrcArray);

		/*
			const int32 Count = SrcArray->Num();
			DestArray->Empty(Count);
			DestArray->Add(Count);

			for (int32 i = 0; i < Count; ++i)
			{
				ArrayProperty->Inner->CopyCompleteValue(
					DestArray->GetData() + i * ArrayProperty->Inner->ElementSize,
					SrcArray->GetData() + i * ArrayProperty->Inner->ElementSize
				);
			}
		*/

		return true;
	}
};

class FScriptSetPropertyWrapper : public FFastPropertyWrapper
{
public:
	explicit FScriptSetPropertyWrapper(FProperty* InProperty) : FFastPropertyWrapper(InProperty) {}

	virtual bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const override
	{
		CHECK_PTR(SrcValuePtr, FScriptSetPropertyWrapper)
		CHECK_PTR(DestValuePtr, FScriptSetPropertyWrapper)

		const FScriptSet* SrcSet = static_cast<const FScriptSet*>(SrcValuePtr);
		FScriptSet* DestSet = static_cast<FScriptSet*>(DestValuePtr);

		if (!SetProperty->ElementProp)
		{
			UE_LOG(LogUnrealPython, Error, TEXT("Invalid set element property"));
			return false;
		}

		SetProperty->CopyCompleteValue(DestSet, SrcSet);
		return true;
	}

	virtual bool ReadUeValue(const void* UeValuePtr, void* OutValue) const override
	{
		CHECK_PTR(UeValuePtr, FScriptSetPropertyWrapper)
		CHECK_PTR(OutValue, FScriptSetPropertyWrapper)

		const FScriptSet* SrcSet = static_cast<const FScriptSet*>(UeValuePtr);
		FScriptSet* DestSet = static_cast<FScriptSet*>(OutValue);

		if (!SetProperty->ElementProp)
		{
			UE_LOG(LogUnrealPython, Error, TEXT("Invalid set element property"));
			return false;
		}

		SetProperty->CopyCompleteValue(DestSet, SrcSet);
		return true;
	}
};

class FScriptMapPropertyWrapper : public FFastPropertyWrapper
{
public:
	explicit FScriptMapPropertyWrapper(FProperty* InProperty) : FFastPropertyWrapper(InProperty) {}

	virtual bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const override
	{
		CHECK_PTR(SrcValuePtr, FScriptMapPropertyWrapper)
		CHECK_PTR(DestValuePtr, FScriptMapPropertyWrapper)

		const FScriptMap* SrcMap = static_cast<const FScriptMap*>(SrcValuePtr);
		FScriptMap* DestMap = static_cast<FScriptMap*>(DestValuePtr);

		if (!MapProperty->KeyProp || !MapProperty->ValueProp)
		{
			UE_LOG(LogUnrealPython, Error, TEXT("Invalid map key or value property"));
			return false;
		}

		MapProperty->CopyCompleteValue(DestMap, SrcMap);
		return true;
	}

	virtual bool ReadUeValue(const void* UeValuePtr, void* OutValue) const override
	{
		CHECK_PTR(UeValuePtr, FScriptMapPropertyWrapper)
		CHECK_PTR(OutValue, FScriptMapPropertyWrapper)

		const FScriptMap* SrcMap = static_cast<const FScriptMap*>(UeValuePtr);
		FScriptMap* DestMap = static_cast<FScriptMap*>(OutValue);

		if (!MapProperty->KeyProp || !MapProperty->ValueProp)
		{
			UE_LOG(LogUnrealPython, Error, TEXT("Invalid map key or value property"));
			return false;
		}

		MapProperty->CopyCompleteValue(DestMap, SrcMap);
		return true;
	}
};

class FDelegatePropertyWrapper : public FPropertyWrapper
{
public:
	explicit FDelegatePropertyWrapper(FProperty* InProperty) : FPropertyWrapper(InProperty) {}

	virtual bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const override
	{
		CHECK_PTR(SrcValuePtr, FDelegatePropertyWrapper)
		CHECK_PTR(DestValuePtr, FDelegatePropertyWrapper)

		const FScriptDelegate* SrcDelegate = static_cast<const FScriptDelegate*>(SrcValuePtr); 
		FScriptDelegate* DestDelegate = DelegateProperty->GetPropertyValuePtr(DestValuePtr);

		if (DestDelegate && SrcDelegate)
		{
			*DestDelegate = *SrcDelegate;
		}
		return true;
	}

	virtual bool ReadUeValue(const void* UeValuePtr, void* OutValue) const override
	{
		CHECK_PTR(UeValuePtr, FDelegatePropertyWrapper)
		CHECK_PTR(OutValue, FDelegatePropertyWrapper)

		const FScriptDelegate* SrcDelegate = static_cast<const FScriptDelegate*>(UeValuePtr);
		FScriptDelegate* DestDelegate = static_cast<FScriptDelegate*>(OutValue);

		DelegateProperty->CopyCompleteValue(DestDelegate, SrcDelegate);
		return true;
	}
};

/*class FOutReflection : public FPropertyWrapperWithDestructor
{
	
};*/

class FFixArrayPropertyWrapper : public FPropertyWrapper
{
public:
	explicit FFixArrayPropertyWrapper(std::unique_ptr<FPropertyWrapper> InInner) : FPropertyWrapper(InInner->GetProperty()) 
	{
		Inner = std::move(InInner);
	}

	bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const override
	{
		return true;
	}

	bool ReadUeValue(const void* UeValuePtr, void* OutValue) const override
	{
		return true;
	}
};

class FDoNothingPropertyWrapper : public FPropertyWrapper
{
public:
	explicit FDoNothingPropertyWrapper(FProperty* InProperty) : FPropertyWrapper(InProperty) {}

	virtual bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const override
	{
		return true;
	}

	virtual bool ReadUeValue(const void* UeValuePtr, void* OutValue) const override
	{
		return true;
	}
};

template <template <class> class Creator, typename Ret>
struct TPropertyWrapperCreator
{
	static Ret DoCreate(FProperty* InProperty, bool bIgnoreOut, void* Ptr)
	{
		if (InProperty->IsA<FByteProperty>() || InProperty->IsA<FInt8Property>() ||
			InProperty->IsA<FInt16Property>() || InProperty->IsA<FIntProperty>() ||
			InProperty->IsA<FUInt16Property>())
		{
			return Creator<FInt32PropertyWrapper>::Create(InProperty, bIgnoreOut, Ptr);
		}
		else if (InProperty->IsA<FInt64Property>())
		{
			return Creator<FInt64PropertyWrapper>::Create(InProperty, bIgnoreOut, Ptr);
		}
		else if (InProperty->IsA<FUInt64Property>())
		{
			return Creator<FUInt64PropertyWrapper>::Create(InProperty, bIgnoreOut, Ptr);
		}
		else if (InProperty->IsA<FDoubleProperty>() || InProperty->IsA<FFloatProperty>())
		{
			return Creator<FNumberPropertyWrapper>::Create(InProperty, bIgnoreOut, Ptr);
		}
		else if (InProperty->IsA<FEnumProperty>())
		{
			return Creator<FEnumPropertyWrapper>::Create(InProperty, bIgnoreOut, Ptr);
		}
		else if (InProperty->IsA<FBoolProperty>())
		{
			return Creator<FBooleanPropertyWrapper>::Create(InProperty, bIgnoreOut, Ptr);
		}
		else if (InProperty->IsA<FStrProperty>())
		{
			return Creator<FStringPropertyWrapper>::Create(InProperty, bIgnoreOut, Ptr);
		}
		else if (InProperty->IsA<FNameProperty>())
		{
			return Creator<FNamePropertyWrapper>::Create(InProperty, bIgnoreOut, Ptr);
		}
		else if (InProperty->IsA<FTextProperty>())
		{
			return Creator<FTextPropertyWrapper>::Create(InProperty, bIgnoreOut, Ptr);
		}
		else if (InProperty->IsA<FClassProperty>())
		{
			return Creator<FClassPropertyWrapper>::Create(InProperty, bIgnoreOut, Ptr);
		}
		else if (InProperty->IsA<FObjectProperty>() ||
				InProperty->IsA<FWeakObjectProperty>() ||
				InProperty->IsA<FLazyObjectProperty>())
		{
			return Creator<FObjectPropertyWrapper>::Create(InProperty, bIgnoreOut, Ptr);
		}
		else if (InProperty->IsA<FSoftClassProperty>())
		{
			return Creator<FSoftClassPropertyWrapper>::Create(InProperty, bIgnoreOut, Ptr);
		}
		else if (InProperty->IsA<FSoftObjectProperty>())
		{
			return Creator<FSoftObjectPropertyWrapper>::Create(InProperty, bIgnoreOut, Ptr);
		}
		else if (InProperty->IsA<FStructProperty>())
		{
			return Creator<FScriptStructPropertyWrapper>::Create(InProperty, bIgnoreOut, Ptr);
		}
		else if (InProperty->IsA<FInterfaceProperty>())
		{
			return Creator<FInterfacePropertyWrapper>::Create(InProperty, bIgnoreOut, Ptr);
		}
		else if (InProperty->IsA<FArrayProperty>())
		{
			return Creator<FScriptArrayPropertyWrapper>::Create(InProperty, bIgnoreOut, Ptr);
		}
		else if (InProperty->IsA<FMapProperty>())
		{
			return Creator<FScriptMapPropertyWrapper>::Create(InProperty, bIgnoreOut, Ptr);
		}
		else if (InProperty->IsA<FSetProperty>())
		{
			return Creator<FScriptSetPropertyWrapper>::Create(InProperty, bIgnoreOut, Ptr);
		}
		else if (InProperty->IsA<FMulticastDelegateProperty>()
#if ENGINE_MINOR_VERSION >= 23 || ENGINE_MAJOR_VERSION > 4
		|| InProperty->IsA<FMulticastInlineDelegateProperty>()
		|| InProperty->IsA<FMulticastSparseDelegateProperty>()
#endif
		)
		{
			return Creator<FDelegatePropertyWrapper>::Create(InProperty, bIgnoreOut, Ptr);
		}
#if ENGINE_MINOR_VERSION >= 23 || ENGINE_MAJOR_VERSION > 4
		else if (InProperty->IsA<FFieldPathProperty>())
		{
			return Creator<FFieldPathPropertyWrapper>::Create(InProperty, bIgnoreOut, Ptr);
		}
#endif
		else
		{
			return Creator<FDoNothingPropertyWrapper>::Create(InProperty, bIgnoreOut, Ptr);
		}
	}
};

template <typename T>
std::unique_ptr<FPropertyWrapper> TCreatePropertyIgnoreOut(FProperty* InProperty)
{
	if (InProperty->ArrayDim > 1)
	{
		return std::make_unique<FFixArrayPropertyWrapper>(std::make_unique<T>(InProperty));
	}
	else
	{
		return std::make_unique<T>(InProperty);
	}
}

template <typename T>
struct UniquePtrCreator
{
	static std::unique_ptr<FPropertyWrapper> Create(FProperty* InProperty, bool bIgnoreOut, void* Ptr)
	{
		return TCreatePropertyIgnoreOut<T>(InProperty);
		/*if (!bIgnoreOut && InProperty->PropertyFlags & CPF_Parm &&
			InProperty->PropertyFlags & CPF_OutParm && !(InProperty->PropertyFlags & CPF_ConstParm) &&
			!(InProperty->PropertyFlags & CPF_ReturnParm))
		{
			// return std::make_unique<>()
			// todo: out property
			return nullptr;
		}
		else
		{
			return TCreatePropertyIgnoreOut<T>(InProperty);
		}*/
	}
};

std::unique_ptr<FPropertyWrapper> FPropertyWrapper::Create(FProperty* InProperty, bool bIgnoreOutput)
{
	return TPropertyWrapperCreator<UniquePtrCreator, std::unique_ptr<FPropertyWrapper>>::DoCreate(InProperty, bIgnoreOutput, nullptr);
}

