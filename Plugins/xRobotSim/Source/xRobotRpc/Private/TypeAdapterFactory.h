#pragma once
#include "ContainerTypeAdapter.h"
#include "StructTypeAdapter.h"

class FTypeContainerFactory
{
public:
	static FStructTypeAdapter* CreateStructType(UStruct* InStruct);
	
};

