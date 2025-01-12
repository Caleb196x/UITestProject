#include "TypeContainerFactory.h"

FStructTypeContainer* FTypeContainerFactory::CreateStructType(UStruct* InStruct)
{
	if (UClass* Class = Cast<UClass>(InStruct))
	{
		return new FClassTypeContainer(Class);
	}
	else if (UScriptStruct* Struct = Cast<UScriptStruct>(InStruct))
	{
		return new FScriptStructTypeContainer(Struct);
	}

	// fixme not support type
	return nullptr;
}