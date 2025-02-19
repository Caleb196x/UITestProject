#include "SmartUIBlueprintAssetTypeActions.h"

// Core includes
#include "SmartUIBlueprint.h"
#include "Misc/MessageDialog.h"
#include "BlueprintEditor.h"

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
	// FMessageDialog::Open(EAppMsgType::Ok, NSLOCTEXT("SmartUIBlueprint", "FailedToOpenBlueprint", "Not support open editor"));

	for (auto ObjIt = InObjects.CreateConstIterator(); ObjIt; ++ObjIt)
	{
		auto Blueprint = Cast<UBlueprint>(*ObjIt);
		if (Blueprint && Blueprint->SkeletonGeneratedClass && Blueprint->GeneratedClass)
		{
			TSharedRef<FBlueprintEditor> NewBlueprintEditor(new FBlueprintEditor());

			TArray<UBlueprint*> Blueprints;
			Blueprints.Add(Blueprint);
			NewBlueprintEditor->InitBlueprintEditor(Mode, EditWithinLevelEditor, Blueprints, false);
		}
		else
		{
			FMessageDialog::Open(EAppMsgType::Ok, NSLOCTEXT("SmartUIBlueprint", "FailedToLoadBlueprint",
				"Blueprint could not be loaded because it derives from an invalid class.  Check to make sure the parent class for this blueprint hasn't been removed!"));
		}
	}
}

uint32 FSmartUIBlueprintAssetTypeActions::GetCategories()
{
	return Categories;
}

