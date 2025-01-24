#include "TypeAdapterFactory.h"

FStructTypeAdapter* FTypeContainerFactory::CreateStructType(UStruct* InStruct)
{
	if (UClass* Class = Cast<UClass>(InStruct))
	{
		return new FClassTypeAdapter(Class);
	}
	else if (UScriptStruct* Struct = Cast<UScriptStruct>(InStruct))
	{
		return new FScriptStructTypeAdapter(Struct);
	}

	// fixme not support type
	return nullptr;
}

FContainerTypeAdapter* FTypeContainerFactory::CreateContainerType(const FString& ContainerType)
{
	return new FContainerTypeAdapter();
}