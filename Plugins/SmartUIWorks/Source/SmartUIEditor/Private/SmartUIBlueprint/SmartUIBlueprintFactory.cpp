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
	if ((ParentClass == NULL) || !FKismetEditorUtilities::CanCreateBlueprintOfClass(ParentClass) || !ParentClass->IsChildOf(USmartUICoreWidget::StaticClass()))
	{
		FFormatNamedArguments Args;
		Args.Add(TEXT("ClassName"), (ParentClass != NULL) ? FText::FromString(ParentClass->GetName()) : NSLOCTEXT("SmartUIWorks", "Null", "(null)"));
		FMessageDialog::Open(EAppMsgType::Ok, FText::Format(NSLOCTEXT("SmartUIWorks", "CannotCreateNoesisBlueprint",
			"Cannot create a SmartUI based on the class '{ClassName}'."), Args));
		return nullptr;
	}
	
	return CastChecked<USmartUIBlueprint>(FKismetEditorUtilities::CreateBlueprint(ParentClass, Parent, Name, BPTYPE_Normal,
		USmartUIBlueprint::StaticClass(), UBlueprintGeneratedClass::StaticClass(),
		"UNoesisBlueprintFactory"));
}
