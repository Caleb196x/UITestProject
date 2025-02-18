#include "SmartUIBlueprintCompilerContext.h"
#include "SmartUIBlueprint.h"
#include "SmartUIBlueprintGeneratedClass.h"
#include "Kismet2/KismetReinstanceUtilities.h"
#include "SmartUICoreWidget.h"

FSmartUIBlueprintCompilerContext::FSmartUIBlueprintCompilerContext(USmartUIBlueprint* SourceBlueprint, FCompilerResultsLog& InMessageLog, const FKismetCompilerOptions& InCompilerOptions)
: Super(SourceBlueprint, InMessageLog, InCompilerOptions)
{
	
}

FSmartUIBlueprintCompilerContext::~FSmartUIBlueprintCompilerContext()
{
	
}

void FSmartUIBlueprintCompilerContext::EnsureProperGeneratedClass(UClass*& TargetUClass)
{
	if (TargetUClass && !((UObject*)TargetUClass)->IsA(USmartUIBlueprintGeneratedClass::StaticClass()))
	{
		FKismetCompilerUtilities::ConsignToOblivion(TargetUClass, Blueprint->bIsRegeneratingOnLoad);
		TargetUClass = nullptr;
	}
}

void FSmartUIBlueprintCompilerContext::SpawnNewClass(const FString& NewClassName)
{
	USmartUIBlueprintGeneratedClass* NoesisBlueprintGeneratedClass = FindObject<USmartUIBlueprintGeneratedClass>(Blueprint->GetOutermost(), *NewClassName);

	if (NoesisBlueprintGeneratedClass == nullptr)
	{
		NoesisBlueprintGeneratedClass = NewObject<USmartUIBlueprintGeneratedClass>(Blueprint->GetOutermost(), FName(*NewClassName), RF_Public | RF_Transactional);
	}
	else
	{
		FBlueprintCompileReinstancer::Create(NoesisBlueprintGeneratedClass);
	}

	NewClass = NoesisBlueprintGeneratedClass;
}

void FSmartUIBlueprintCompilerContext::CopyTermDefaultsToDefaultObject(UObject* DefaultObject)
{
	if (USmartUICoreWidget* DefaultInstance = Cast<USmartUICoreWidget>(DefaultObject))
	{
		USmartUIBlueprint* SmartUIBlueprint = CastChecked<USmartUIBlueprint>(Blueprint);
		DefaultInstance->SetWidgetName(SmartUIBlueprint->WidgetName);
	}
}
