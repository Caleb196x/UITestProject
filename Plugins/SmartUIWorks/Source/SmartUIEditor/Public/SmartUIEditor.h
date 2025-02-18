#pragma once

#include "CoreMinimal.h"
#include "Modules/ModuleManager.h"

class FSmartUIEditorModule : public IModuleInterface
{
public:
    virtual void StartupModule() override;
    virtual void ShutdownModule() override;

    TSharedPtr<class FSmartUIBlueprintAssetTypeActions> TestBlueprintAssetTypeActions;
    TSharedPtr<class FSmartUIBlueprintCompiler> SmartUIBlueprintCompiler;
};