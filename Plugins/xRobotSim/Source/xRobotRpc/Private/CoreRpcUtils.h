#pragma once
#include "StructTypeContainer.h"

#define RELEASED_UOBJECT ((UObject*) 12)
#define RELEASED_UOBJECT_MEMBER ((void*) 12)

FORCEINLINE bool UEObjectIsPendingKill(const UObject* Test)
{
#if ENGINE_MAJOR_VERSION > 4
	return !IsValid(Test) || Test->IsUnreachable();
#else
	return Test->IsPendingKillOrUnreachable();
#endif
}

template <typename T>
T* FindAnyType(const TCHAR* InShortName)
{
#if (ENGINE_MAJOR_VERSION == 5 && ENGINE_MINOR_VERSION >= 1) || ENGINE_MAJOR_VERSION > 5
	return FindFirstObject<T>(
		InShortName, EFindFirstObjectOptions::EnsureIfAmbiguous | EFindFirstObjectOptions::NativeFirst, ELogVerbosity::Error);
#else
	return FindObject<T>(ANY_PACKAGE, InShortName);
#endif
}

FORCEINLINE int32 GetSizeWithAlignment(FProperty* InProperty)
{
	return Align(InProperty->GetSize(), InProperty->GetMinAlignment());
}

template <typename T>
T* FindAnyType(const FString& InShortName)
{
	return FindAnyType<T>(*InShortName);
}

class FCoreUtils
{
public:
	static FStructTypeContainer* LoadUEStructType(const FString& TypeName);

	static UEnum* LoadUEEnumType(const FString& EnumTypeName);

	static FStructTypeContainer* GetUEStructType(const FString& TypeName);

	static std::string ConvertUeTypeNameToRpcTypeName(const FString& TypeName);

	FORCEINLINE static bool IsReleasePtr(void* Ptr)
	{
		return RELEASED_UOBJECT_MEMBER == Ptr;
	}

private:
	static TMap<UField*, FStructTypeContainer*> ClassTypeContainerCache;
};

