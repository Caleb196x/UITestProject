#include "SmartUIBlueprintFactory.h"

#include "Kismet2/KismetEditorUtilities.h"
#include "SmartUIBlueprint.h"
#include "SmartUICoreWidget.h"


USmartUIBlueprintFactory::USmartUIBlueprintFactory(const FObjectInitializer& ObjectInitializer)
	: Super(ObjectInitializer)
{
	bCreateNew = true;
	SupportedClass = USmartUIBlueprint::StaticClass();
	ParentClass = USmartUICoreWidget::StaticClass();
}

UObject* USmartUIBlueprintFactory::FactoryCreateNew(UClass* Class, UObject* Parent, FName Name, EObjectFlags Flags, UObject* Context, FFeedbackContext* Warn)
{
	return CastChecked<USmartUIBlueprintFactory>(FKismetEditorUtilities::CreateBlueprint(ParentClass, Parent, Name, BPTYPE_Normal,
		USmartUIBlueprint::StaticClass(), UBlueprintGeneratedClass::StaticClass(),
		"UNoesisBlueprintFactory"));
}
