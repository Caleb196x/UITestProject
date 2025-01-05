#pragma once
#include "StructTypeContainer.h"

class FTypeContainerFactory
{
public:
	static FStructTypeContainer* CreateStructType(UStruct* InStruct);
};

