#include "CoreUtils.h"
#include "CoreMinimal.h"
#include "RpcException.h"

namespace xRobotRpc
{
	FStructTypeContainer* FCoreUtils::LoadUEType(const FString& TypeName)
	{
		// find
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
		if (Type && !Type->HasAnyCastFlags(EClassFlags::CLASS_Native))
		{
			// throw exception
			ThrowRuntimeRpcException("not native class");
		}

		// find type container in cache map
		if (ClassTypeContainerCache.Contains(Type))
		{
			return ClassTypeContainerCache[Type];
		}
		
		// create new type container
		FStructTypeContainer* NewTypeContainer = nullptr;
		ClassTypeContainerCache.Add(Type, NewTypeContainer);
		return NewTypeContainer;
	}

}