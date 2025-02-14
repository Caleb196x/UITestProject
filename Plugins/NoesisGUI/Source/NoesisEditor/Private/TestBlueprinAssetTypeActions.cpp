#include "TestBlueprinAssetTypeActions.h"

// Core includes
#include "Misc/MessageDialog.h"

// NoesisEditor includes
#include "NoesisBlueprintEditor.h"

// NoesisRuntime includes
#include "NoesisBlueprint.h"
#include "TestBlueprint.h"

#define LOCTEXT_NAMESPACE "NoesisEditorModule"

FTestBlueprintAssetTypeActions::FTestBlueprintAssetTypeActions(EAssetTypeCategories::Type InCategories)
	: Categories(InCategories)
{
};

FText FTestBlueprintAssetTypeActions::GetName() const
{
	return LOCTEXT("TestBlueprintAssetTypeActions_Name", "TestBlueprintType");
}

UClass* FTestBlueprintAssetTypeActions::GetSupportedClass() const
{
	return UTestBlueprint::StaticClass();
}

FColor FTestBlueprintAssetTypeActions::GetTypeColor() const
{
	return FColor(42, 166, 226);
}

void FTestBlueprintAssetTypeActions::OpenAssetEditor(const TArray<UObject*>& InObjects, TSharedPtr<IToolkitHost> EditWithinLevelEditor)
{
	EToolkitMode::Type Mode = EditWithinLevelEditor.IsValid() ? EToolkitMode::WorldCentric : EToolkitMode::Standalone;

	for (auto ObjIt = InObjects.CreateConstIterator(); ObjIt; ++ObjIt)
	{
		auto Blueprint = Cast<UBlueprint>(*ObjIt);
		if (Blueprint && Blueprint->SkeletonGeneratedClass && Blueprint->GeneratedClass)
		{
			TSharedRef<FNoesisBlueprintEditor> NewBlueprintEditor(new FNoesisBlueprintEditor());

			TArray<UBlueprint*> Blueprints;
			Blueprints.Add(Blueprint);
			NewBlueprintEditor->InitNoesisBlueprintEditor(Mode, EditWithinLevelEditor, Blueprints, false);
		}
		else
		{
			FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("FailedToLoadBlueprint", "Blueprint could not be loaded because it derives from an invalid class.  Check to make sure the parent class for this blueprint hasn't been removed!"));
		}
	}
}

uint32 FTestBlueprintAssetTypeActions::GetCategories()
{
	return Categories;
}

#undef LOCTEXT_NAMESPACE
