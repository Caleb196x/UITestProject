#include "SmartUIBlueprintCompiler.h"
#include "SmartUIBlueprint.h"
#include "SmartUIBlueprintGeneratedClass.h"
#include "SmartUICoreWidget.h"

bool FSmartUIBlueprintCompiler::CanCompile(const UBlueprint* Blueprint)
{
	return Blueprint->IsA(USmartUIBlueprint::StaticClass());
}

void FSmartUIBlueprintCompiler::PostCompile(UBlueprint* Blueprint)
{
	
}

void FSmartUIBlueprintCompiler::PreCompile(UBlueprint* Blueprint)
{
	
}

void FSmartUIBlueprintCompiler::Compile(UBlueprint* Blueprint, const FKismetCompilerOptions& CompilerOptions, FCompilerResultsLog& Results)
{
	// todo: convert typescript to javascript: run tsc command
	if (USmartUIBlueprint* SmartUIBlueprint = Cast<USmartUIBlueprint>(Blueprint))
	{
		
	}
}

bool FSmartUIBlueprintCompiler::GetBlueprintTypesForClass(UClass* ParentClass, UClass*& OutBlueprintClass, UClass*& OutBlueprintGeneratedClass) const
{
	if (ParentClass->IsChildOf<USmartUICoreWidget>())
	{
		OutBlueprintClass = USmartUIBlueprint::StaticClass();
		OutBlueprintGeneratedClass = USmartUIBlueprintGeneratedClass::StaticClass();
		return true;
	}

	return false;
}




