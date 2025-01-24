#include "ContainerTypeAdapter.h"

void* FContainerTypeAdapter::NewContainer(const FString& TypeName, FProperty* InValueProp, FProperty* InKeyProp)
{
	if (TypeName.Equals("Map"))
	{
		if (InKeyProp)
		{
			return new FScriptMapExtension(InKeyProp, InValueProp);
		}
			
		UE_LOG(LogUnrealPython, Error, TEXT("Failed to create FScriptMapExtension, key property is invalid"));
		return nullptr;
	}

	if (TypeName.Equals("Array"))
	{
		
		return new FScriptArrayExtension(InValueProp);
	}

	if (TypeName.Equals("Set"))
	{
		return new FScriptSetExtension(InValueProp);
	}
}