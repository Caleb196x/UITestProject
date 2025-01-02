#include "PropertyWrapper.h"

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

namespace xRobotRpc
{
	std::any FPropertyWrapper::Getter(UObject* Owner)
	{
		return std::any();
	}

	void FPropertyWrapper::Setter(UObject* Owner, const std::any& InValue)
	{
		
	}
	
	class FInt32PropertyWrapper : public FPropertyWrapper
	{
	public:
		explicit FInt32PropertyWrapper(FProperty* InProperty) : FPropertyWrapper(InProperty) {}

		virtual bool AnyToUeValue(const std::any& InValue, void* ValuePtr) const override
		{
			CATCH_ANY_CAST_EXCEPTION({
				const int32 Value = std::any_cast<int32>(InValue);
				NumericProperty->SetIntPropertyValue(ValuePtr, static_cast<uint64>(Value));
			}, "int32")
		}

		virtual bool UeValueToAny(const void* ValuePtr, std::any& OutValue) const override
		{
			CATCH_ANY_CAST_EXCEPTION({
				const int32 Value = static_cast<int32>(NumericProperty->GetSignedIntPropertyValue(ValuePtr));
				OutValue = Value;
			}, "int32")
		}
	};

	class FUInt32PropertyWrapper : public FPropertyWrapper
	{
	public:
		explicit FUInt32PropertyWrapper(FProperty* InProperty) : FPropertyWrapper(InProperty) { }

		virtual bool AnyToUeValue(const std::any& InValue, void* ValuePtr) const override
		{
			CATCH_ANY_CAST_EXCEPTION({
				const uint32 Value = std::any_cast<uint32>(InValue);
				NumericProperty->SetIntPropertyValue(ValuePtr, static_cast<uint64>(Value));
			}, "uint32")
		}

		virtual bool UeValueToAny(const void* ValuePtr, std::any& OutValue) const override
		{
			CATCH_ANY_CAST_EXCEPTION({
				const uint32 Value = static_cast<uint32>(NumericProperty->GetUnsignedIntPropertyValue(ValuePtr));
				OutValue = Value;
			}, "uint32")
		}
	};

	class FInt64PropertyWrapper : public FPropertyWrapper
	{
	public:
		explicit FInt64PropertyWrapper(FProperty* InProperty) : FPropertyWrapper(InProperty) { }

		virtual bool AnyToUeValue(const std::any& InValue, void* ValuePtr) const override
		{
			CATCH_ANY_CAST_EXCEPTION({
				const int64 Value = std::any_cast<int64>(InValue);
				NumericProperty->SetIntPropertyValue(ValuePtr, static_cast<int64>(Value));
			}, "int64")
		}

		virtual bool UeValueToAny(const void* ValuePtr, std::any& OutValue) const override
		{
			CATCH_ANY_CAST_EXCEPTION({
				const int64 Value = static_cast<int64>(NumericProperty->GetSignedIntPropertyValue(ValuePtr));
				OutValue = Value;
			}, "int64")
		}
	};

	class FUInt64PropertyWrapper : public FPropertyWrapper
	{
	public:
		explicit FUInt64PropertyWrapper(FProperty* InProperty) : FPropertyWrapper(InProperty) { }

		virtual bool AnyToUeValue(const std::any& InValue, void* ValuePtr) const override
		{
			CATCH_ANY_CAST_EXCEPTION({
				const uint64 Value = std::any_cast<uint64>(InValue);
				NumericProperty->SetIntPropertyValue(ValuePtr, static_cast<int64>(Value));
			}, "uint64")
		}

		virtual bool UeValueToAny(const void* ValuePtr, std::any& OutValue) const override
		{
			CATCH_ANY_CAST_EXCEPTION({
				const uint64 Value = static_cast<uint64>(NumericProperty->GetUnsignedIntPropertyValue(ValuePtr));
				OutValue = Value;
			}, "uint64")
		}
	};

	class FNumberPropertyWrapper : public FPropertyWrapper
	{
	public:
		explicit FNumberPropertyWrapper(FProperty* InProperty) : FPropertyWrapper(InProperty) { }

		virtual bool AnyToUeValue(const std::any& InValue, void* ValuePtr) const override
		{
			CATCH_ANY_CAST_EXCEPTION({
				const double Value = std::any_cast<double>(InValue);
				NumericProperty->SetFloatingPointPropertyValue(ValuePtr, Value);
			}, "double")
		}

		virtual bool UeValueToAny(const void* ValuePtr, std::any& OutValue) const override
		{
			CATCH_ANY_CAST_EXCEPTION({
				const double Value = NumericProperty->GetFloatingPointPropertyValue(ValuePtr);
				OutValue = Value;
			}, "double")
		}
	};

	class FBooleanPropertyWrapper : public FPropertyWrapper
	{
	public:
		explicit FBooleanPropertyWrapper(FProperty* InProperty) : FPropertyWrapper(InProperty) { }

		virtual bool AnyToUeValue(const std::any& InValue, void* ValuePtr) const override
		{
			CATCH_ANY_CAST_EXCEPTION({
				const bool Value = std::any_cast<bool>(InValue);
				BoolProperty->SetPropertyValue(ValuePtr, Value);
			}, "bool")
		}

		virtual bool UeValueToAny(const void* ValuePtr, std::any& OutValue) const override
		{
			CATCH_ANY_CAST_EXCEPTION({
				const bool Value = BoolProperty->GetPropertyValue(ValuePtr);
				OutValue = Value;
			}, "bool")
		}
	};

	class FEnumPropertyWrapper : public FPropertyWrapper
	{
	public:
		explicit FEnumPropertyWrapper(FProperty* InProperty) : FPropertyWrapper(InProperty) { }

		virtual bool AnyToUeValue(const std::any& InValue, void* ValuePtr) const override
		{
			CATCH_ANY_CAST_EXCEPTION({
				const int32 Value = std::any_cast<int32>(InValue);
				EnumProperty->GetUnderlyingProperty()->SetIntPropertyValue(ValuePtr, static_cast<uint64>(Value));
			}, "enum")
		}

		virtual bool UeValueToAny(const void* ValuePtr, std::any& OutValue) const override
		{
			CATCH_ANY_CAST_EXCEPTION({
				const int32 Value = static_cast<int32>(EnumProperty->GetUnderlyingProperty()->GetSignedIntPropertyValue(ValuePtr));
				OutValue = Value;
			}, "enum")
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

		virtual bool AnyToUeValue(const std::any& InValue, void* ValuePtr) const override
		{
			CATCH_ANY_CAST_EXCEPTION({
				const FString Value = std::any_cast<FString>(InValue);
				StrProperty->SetPropertyValue(ValuePtr, Value);
			}, "FString")
		}

		virtual bool UeValueToAny(const void* ValuePtr, std::any& OutValue) const override
		{
			CATCH_ANY_CAST_EXCEPTION({
				FString Value = StrProperty->GetPropertyValue(ValuePtr);
				OutValue = Value;
			}, "FString")
		}
	};

	class FNamePropertyWrapper : public FPropertyWrapperWithDestructor
	{
	public:
		explicit FNamePropertyWrapper(FProperty* InProperty) : FPropertyWrapperWithDestructor(InProperty) {}

		virtual bool UeValueToAny(const void* ValuePtr, std::any& OutValue) const override
		{
			CATCH_ANY_CAST_EXCEPTION({
				const FName Value = NameProperty->GetPropertyValue(ValuePtr);
				const FString StrVal = Value.ToString();
				OutValue = StrVal;
			}, "Name")
		}

		virtual bool AnyToUeValue(const std::any& InValue, void* ValuePtr) const override
		{
			CATCH_ANY_CAST_EXCEPTION({
				const FString Value = std::any_cast<FString>(InValue);
				const FName NameVal = FName(*Value);
				NameProperty->SetPropertyValue(ValuePtr, NameVal);
			}, "Name")
		}
	};

	class FTextPropertyWrapper : public FPropertyWrapperWithDestructor
	{
	public:
		explicit FTextPropertyWrapper(FProperty* InProperty) : FPropertyWrapperWithDestructor(InProperty) {}

		virtual bool UeValueToAny(const void* ValuePtr, std::any& OutValue) const override
		{
			CATCH_ANY_CAST_EXCEPTION({
				const FText TextVal = TextProperty->GetPropertyValue(ValuePtr);
				const FString StrVal = TextVal.ToString();
				OutValue = StrVal;
			}, "Text")
		}

		virtual bool AnyToUeValue(const std::any& InValue, void* ValuePtr) const override
		{
			CATCH_ANY_CAST_EXCEPTION({
				const FString Value = std::any_cast<FString>(InValue);
				const FText TextVal = FText::FromString(Value);
				TextProperty->SetPropertyValue(ValuePtr, TextVal);
			}, "Text")
		}
	};

	class FObjectPropertyWrapper : public FPropertyWrapperWithDestructor
	{
	public:
		explicit FObjectPropertyWrapper(FProperty* InProperty) : FPropertyWrapperWithDestructor(InProperty) {}

		virtual bool UeValueToAny(const void* ValuePtr, std::any& OutValue) const override
		{
			CATCH_ANY_CAST_EXCEPTION({
				UObject* UEObj = ObjectProperty->GetObjectPropertyValue(ValuePtr);
				
			}, "Object")
		}

		virtual bool AnyToUeValue(const std::any& InValue, void* ValuePtr) const override
		{
			// Property->GetName();
			CATCH_ANY_CAST_EXCEPTION({
				
			}, "Object")
		}
	};
}
