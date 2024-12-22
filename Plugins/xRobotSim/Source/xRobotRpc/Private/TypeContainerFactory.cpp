#include "TypeContainerFactory.h"

namespace xRobotRpc
{
	FStructTypeContainer* FTypeContainerFactory::CreateStructType(UStruct* InStruct)
	{
		return new FStructTypeContainer(InStruct);
	}

}