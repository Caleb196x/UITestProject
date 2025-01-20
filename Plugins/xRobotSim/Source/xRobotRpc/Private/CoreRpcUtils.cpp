#include "CoreRpcUtils.h"

#include <unordered_map>

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


std::string FCoreUtils::ConvertUeTypeNameToRpcTypeName(const FString& TypeName)
{
	const std::string InName = TCHAR_TO_UTF8(*TypeName);

	// todo: add more type
	std::unordered_map<std::string, std::string> TypeMapping = {
		{"FString", "str"},
		{"FText", "str"},
		{"FName", "str"},
		{"int8", "int"},
		{"int16", "int"},
		{"int32", "int"},
		{"int64", "int"},
		{"uint8", "uint"},
		{"uint16", "uint"},
		{"uint32", "uint"},
		{"uint64", "uint"},
		{"float", "float"},
		{"double", "float"},
		{"bool", "bool"},
		{"int8_t", "int"},
		{"int16_t", "int"},
		{"int32_t", "int"},
		{"int64_t", "int"},
		{"uint8_t", "uint"},
		{"uint16_t", "uint"},
		{"uint32_t", "uint"},
		{"uint64_t", "uint"},
	};

	if (TypeMapping.contains(InName))
	{
		return TypeMapping.at(InName);
	}
	else
	{
		return "object";
	}
}
