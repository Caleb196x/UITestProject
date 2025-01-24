#pragma once
#include "ContainerTypeAdapter.h"
#include "StructTypeAdapter.h"

class FTypeContainerFactory
{
public:
	static FStructTypeAdapter* CreateStructType(UStruct* InStruct);

	static FContainerTypeAdapter* CreateContainerType(const FString& ContainerType);
};

