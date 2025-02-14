#include "TestBlueprint.h"
UTestBlueprint::UTestBlueprint(const FObjectInitializer& ObjectInitializer)
	: Super(ObjectInitializer)
{
	bRecompileOnLoad = false;

	EnableKeyboard = true;
	EnableMouse = true;
	EmulateTouch = false;
	EnableTouch = true;
}

#if WITH_EDITOR
UClass* UTestBlueprint::GetBlueprintClass() const
{
	return UBlueprintGeneratedClass::StaticClass();
}

bool UTestBlueprint::SupportedByDefaultBlueprintFactory() const
{
	return false;
}
#endif // WITH_EDITOR