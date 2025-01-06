#include "TypeContainerFactory.h"

FStructTypeContainer* FTypeContainerFactory::CreateStructType(UStruct* InStruct)
{
	return new FStructTypeContainer(InStruct);
}