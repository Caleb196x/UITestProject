#pragma once
#include <any>
#include <memory>

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

	// static std::unique_ptr<FPropertyWrapper> CreateWithPlacement(FProperty* InProperty, FPropertyWrapper* InOldProperty);

	virtual bool CopyToUeValue(const void* SrcValuePtr, void* DestValuePtr) const = 0;

	virtual bool ReadUeValue(const void* UeValuePtr, void* OutValue) const = 0;

	virtual bool CopyToUeValueFast(const void* SrcValuePtr, void* TempBuffer, void** OutValuePtr) const
	{
		*OutValuePtr = TempBuffer;
		return CopyToUeValue(SrcValuePtr, TempBuffer);
	}
	
	virtual void Cleanup(void* ContainerPtr) const {}
	
	virtual ~FPropertyWrapper() {}

	void* Getter(UObject* Owner);
	
	void Setter(UObject* Owner, const void* InValue);

	FORCEINLINE bool IsOutProperty() const
	{
		return bIsOut;
	}
	
	FORCEINLINE bool CopyToUeValueInContainer(const void* InValue, void* ContainerPtr) const
	{
		return CopyToUeValue(InValue, Property->ContainerPtrToValuePtr<void>(ContainerPtr));
	}

	FORCEINLINE bool CopyToUeValueFastInContainer(const void* InValue, void* TempBuffer, void** OutValuePtr) const
	{
		return CopyToUeValueFast(InValue, Property->ContainerPtrToValuePtr<void>(TempBuffer), OutValuePtr);
	}

	FORCEINLINE bool ReadUeValueInContainer(const void* ContainerPtr, void* OutValue) const
	{
		return ReadUeValue(Property->ContainerPtrToValuePtr<void>(ContainerPtr), OutValue);
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
		FObjectPropertyBase* ObjectBaseProperty;
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

	std::unique_ptr<FPropertyWrapper> Inner;
	
	TWeakObjectPtr<FProperty> PropertyWeakPtr;
};
