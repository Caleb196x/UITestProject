#pragma once
#include "StructTypeContainer.h"

namespace xRobotRpc
{
	class FTypeContainerFactory
	{
	public:
		static FStructTypeContainer* CreateStructType(UStruct* InStruct);
	};
}

