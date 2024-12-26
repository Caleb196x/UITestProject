#pragma once
#include <any>
#include <memory>

namespace xRobotRpc
{
	class FPropertyWrapper
	{
	public:
		explicit FPropertyWrapper(FProperty* InProperty, bool bInIsOut = false)
		: Property(InProperty),
		bOwnerIsClass(InProperty->GetOwnerClass() != nullptr),
		bNeedLinkOuter(false),
		bIsOut(bInIsOut),
		PropertyWeakPtr(InProperty)
		{
			if (!bOwnerIsClass)
			{
				if (InProperty->IsA<FStructProperty>() ||
					InProperty->IsA<FMapProperty>() ||
					InProperty->IsA<FArrayProperty>() ||
					InProperty->IsA<FSetProperty>())
				{
					bNeedLinkOuter = true;
				}
			}
		}

		static std::unique_ptr<FPropertyWrapper> Create(FProperty* InProperty, bool bIgnoreOutput = false);

		static std::unique_ptr<FPropertyWrapper> CreateWithPlacement(FProperty* InProperty, FPropertyWrapper* InOldProperty);

		virtual bool AnyToUeValue(const std::any& InValue, void* ValuePtr) const = 0;

		virtual bool UeValueToAny(const void* ValuePtr, std::any& OutValue) const = 0;
		
		virtual void Cleanup(void* ContainerPtr) const {}
		
		virtual ~FPropertyWrapper() {}

		std::any Getter(UObject* Owner);
		
		void Setter(UObject* Owner, const std::any& InValue);

		FORCEINLINE bool IsOutProperty() const
		{
			return bIsOut;
		}
		
		FORCEINLINE bool AnyToUeValueInContainer(const std::any& InValue, void* ContainerPtr) const
		{
			return AnyToUeValue(InValue, Property->ContainerPtrToValuePtr<void>(ContainerPtr));
		}

		FORCEINLINE bool UeValueToAnyInContainer(const void* ContainerPtr, std::any& OutValue) const
		{
			return UeValueToAny(Property->ContainerPtrToValuePtr<void>(ContainerPtr), OutValue);
		}
		
		FORCEINLINE FProperty* GetProperty() const { return PropertyWeakPtr.Get(); }

		FORCEINLINE bool IsPropertyValid() const
		{
			if (!PropertyWeakPtr.IsValid())
			{
				return false;
			}
			
			return true;
		}

		FORCEINLINE FString GetCppType() const { return Property->GetCPPType(); }
		
	protected:

		// auto cast to different property type
		union
		{
			FProperty* Property;
			FNumericProperty* NumericProperty;
			FIntProperty* IntProperty;
			FEnumProperty* EnumProperty;
			FBoolProperty* BoolProperty;
			FObjectProperty* ObjectProperty;
			FSoftObjectProperty* SoftObjectProperty;
			FSoftClassProperty* SoftClassProperty;
			FInterfaceProperty* InterfaceProperty;
			FNameProperty* NameProperty;
			FStrProperty* StrProperty;
			FTextProperty* TextProperty;
			FArrayProperty* ArrayProperty;
			FMapProperty* MapProperty;
			FSetProperty* SetProperty;
			FStructProperty* StructProperty;
			FDelegateProperty* DelegateProperty;
			FMulticastDelegateProperty* MulticastDelegateProperty;
			FClassProperty* ClassProperty;
#if ENGINE_MAJOR_VERSION > 4 ||ENGINE_MAJOR_VERSION >= 25
			FFieldPathProperty* FieldPathProperty;
#endif
			
		};
		
		bool bOwnerIsClass;

		bool bNeedLinkOuter;
		
		bool bIsOut;
		
		TWeakObjectPtr<FProperty> PropertyWeakPtr;
	};
}
