#include "CoreRpcUtils.h"
#include "CoreMinimal.h"
#include "RpcException.h"
#include "TypeContainerFactory.h"

TMap<UField*, FStructTypeContainer*> FCoreUtils::ClassTypeContainerCache = {};

FStructTypeContainer* FCoreUtils::LoadUEStructType(const FString& TypeName)
{
	// find
	UField* Type = FindAnyType<UClass>(TypeName);

	if (!Type)
	{
		Type = FindAnyType<UScriptStruct>(TypeName);
	}

	if (!Type)
	{
		Type = LoadObject<UClass>(nullptr, *TypeName);
	}

	if (!Type)
	{
		Type = LoadObject<UScriptStruct>(nullptr, *TypeName);
	}
	
	// blueprint class type
	if (Type && !Type->IsNative())
	{
		// throw exception
		return nullptr;
	}

	// find type container in cache map
	if (ClassTypeContainerCache.Contains(Type))
	{
		return ClassTypeContainerCache[Type];
	}
	
	// create new type container
	if (const auto Struct = Cast<UStruct>(Type))
	{
		FStructTypeContainer* NewTypeContainer = FTypeContainerFactory::CreateStructType(Struct); // TODO: create type container
		ClassTypeContainerCache.Add(Type, NewTypeContainer);
		return NewTypeContainer;
	}

	if (const auto Enum = Cast<UEnum>(Type))
	{
		// TODO: implement enum type
		return nullptr;
	}
	
	return nullptr;
}

UEnum* FCoreUtils::LoadUEEnumType(const FString& EnumTypeName)
{
	UField* Type = FindAnyType<UEnum>(EnumTypeName);

	if (!Type)
	{
		Type = LoadObject<UEnum>(nullptr, *EnumTypeName);
	}

	if (UEnum* Enum = Cast<UEnum>(Type))
	{
		return Enum;
	}
	
	return nullptr; 
}

// todo: impl more reliable
FStructTypeContainer* FCoreUtils::GetUEStructType(const FString& TypeName)
{
	UField* Type = FindAnyType<UClass>(TypeName);

	if (!Type)
	{
		Type = FindAnyType<UScriptStruct>(TypeName);
	}

	if (!Type)
	{
		Type = FindAnyType<UEnum>(TypeName);
	}

	if (!Type)
	{
		Type = LoadObject<UClass>(nullptr, *TypeName);
	}

	if (!Type)
	{
		Type = LoadObject<UScriptStruct>(nullptr, *TypeName);
	}

	if (!Type)
	{
		Type = LoadObject<UEnum>(nullptr, *TypeName);
	}

	// blueprint class type
	if (Type && !Type->IsNative())
	{
		// throw exception
		// fixme: do not throw exception
		return nullptr;
	}

	// find type container in cache map
	if (ClassTypeContainerCache.Contains(Type))
	{
		return ClassTypeContainerCache[Type];
	}
	else
	{
		return nullptr;
	}
}