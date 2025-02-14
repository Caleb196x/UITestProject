#pragma once

// AssetTools includes
#include "AssetTypeActions_Base.h"

class FTestBlueprintAssetTypeActions : public FAssetTypeActions_Base
{
public:
	FTestBlueprintAssetTypeActions(EAssetTypeCategories::Type Categories);

	// IAssetTypeActions interface
	virtual FText GetName() const override;
	virtual UClass* GetSupportedClass() const override;
	virtual FColor GetTypeColor() const override;
	virtual void OpenAssetEditor(const TArray<UObject*>& InObjects, TSharedPtr<IToolkitHost> EditWithinLevelEditor) override;
	virtual uint32 GetCategories() override;
	// End of IAssetTypeActions interface

private:
	EAssetTypeCategories::Type Categories;
};
