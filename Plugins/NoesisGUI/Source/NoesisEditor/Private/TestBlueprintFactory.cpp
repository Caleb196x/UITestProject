#include "TestBlueprintFactory.h"

UTestBlueprintFactory::UTestBlueprintFactory(const FObjectInitializer& ObjectInitializer)
	: Super(ObjectInitializer)
{
	
	bCreateNew = true;

	SupportedClass = UTestBlueprint::StaticClass();
}

UObject* UTestBlueprintFactory::FactoryCreateNew(UClass* Class, UObject* Parent, FName Name, EObjectFlags Flags, UObject* Context, FFeedbackContext* Warn)
{
	return CastChecked<UTestBlueprint>(FKismetEditorUtilities::CreateBlueprint(UBlueprint::StaticClass(), Parent, Name, BPTYPE_Normal,
		UTestBlueprint::StaticClass(), UBlueprintGeneratedClass::StaticClass(), "UTestBlueprintFactory"));
}