#include "SmartUIBlueprintAssetTypeActions.h"

// Core includes
#include "SmartUIBlueprint.h"
#include "Misc/MessageDialog.h"

FSmartUIBlueprintAssetTypeActions::FSmartUIBlueprintAssetTypeActions(EAssetTypeCategories::Type InCategories)
	: Categories(InCategories)
{
};

FText FSmartUIBlueprintAssetTypeActions::GetName() const
{
	return NSLOCTEXT("SmartUIBlueprint", "SmartUIBlueprintAssetTypeActions_Name", "SmartUI");
}

UClass* FSmartUIBlueprintAssetTypeActions::GetSupportedClass() const
{
	return USmartUIBlueprint::StaticClass();
}

FColor FSmartUIBlueprintAssetTypeActions::GetTypeColor() const
{
	return FColor(42, 166, 226);
}

void FSmartUIBlueprintAssetTypeActions::OpenAssetEditor(const TArray<UObject*>& InObjects, TSharedPtr<IToolkitHost> EditWithinLevelEditor)
{
	EToolkitMode::Type Mode = EditWithinLevelEditor.IsValid() ? EToolkitMode::WorldCentric : EToolkitMode::Standalone;
	FMessageDialog::Open(EAppMsgType::Ok, NSLOCTEXT("SmartUIBlueprint", "FailedToOpenBlueprint", "Not support open editor"));
}

uint32 FSmartUIBlueprintAssetTypeActions::GetCategories()
{
	return Categories;
}

