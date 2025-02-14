#pragma once
#include "TestBlueprint.h"
#include "TestBlueprintFactory.generated.h"

UCLASS()
class UTestBlueprintFactory : public UFactory
{
	GENERATED_UCLASS_BODY()
public:
	virtual UObject* FactoryCreateNew(UClass* Class, UObject* Parent, FName Name, EObjectFlags Flags, UObject* Context, FFeedbackContext* Warn) override;
};
