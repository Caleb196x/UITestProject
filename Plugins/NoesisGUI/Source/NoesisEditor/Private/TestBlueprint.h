#pragma once
#include "TestBlueprint.generated.h"

UCLASS()
class  UTestBlueprint : public UBlueprint
{
	GENERATED_UCLASS_BODY()
public:
	// UBlueprint interface
#if WITH_EDITOR
	virtual UClass* GetBlueprintClass() const override;
	virtual bool SupportedByDefaultBlueprintFactory() const override;
#endif // WITH_EDITOR
	
	UPROPERTY(EditAnywhere, Category = "Test Blueprint")
	bool EnableKeyboard;

	UPROPERTY(EditAnywhere, Category = "Test Blueprint")
	bool EnableMouse;

	UPROPERTY(EditAnywhere, Category = "Test Blueprint", meta = (EditCondition = "EnableMouse"))
	bool EmulateTouch;

	UPROPERTY(EditAnywhere, Category = "Test Blueprint")
	bool EnableTouch;
};
