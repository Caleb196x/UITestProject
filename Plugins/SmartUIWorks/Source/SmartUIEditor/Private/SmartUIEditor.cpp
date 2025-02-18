#include "SmartUIEditor.h"
#include "AssetToolsModule.h"
#include "LogSmartUI.h"
#include "SmartUIBlueprint/SmartUIBlueprintAssetTypeActions.h"

#define LOCTEXT_NAMESPACE "FSmartUIEditorModule"

void FSmartUIEditorModule::StartupModule()
{
	IAssetTools& AssetTools = FModuleManager::LoadModuleChecked<FAssetToolsModule>("AssetTools").Get();

	EAssetTypeCategories::Type Category = AssetTools.RegisterAdvancedAssetCategory(FName(TEXT("SmartUIWorks")),
		LOCTEXT("SmartUIWorksCategory", "SmartUIWorks"));
	TestBlueprintAssetTypeActions = MakeShareable(new FSmartUIBlueprintAssetTypeActions(Category));
	AssetTools.RegisterAssetTypeActions(TestBlueprintAssetTypeActions.ToSharedRef());
	
}

void FSmartUIEditorModule::ShutdownModule()
{
	
}

#undef LOCTEXT_NAMESPACE
    
IMPLEMENT_MODULE(FSmartUIEditorModule, SmartUIEditor)
