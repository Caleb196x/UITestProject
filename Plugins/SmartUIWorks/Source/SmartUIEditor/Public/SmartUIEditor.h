#pragma once

#include "CoreMinimal.h"
#include "Modules/ModuleManager.h"

class SMARTUIWORKS_API ISmartUIEditorModuleInterface : public IModuleInterface
{
public:

    static ISmartUIEditorModuleInterface* Get();
};
