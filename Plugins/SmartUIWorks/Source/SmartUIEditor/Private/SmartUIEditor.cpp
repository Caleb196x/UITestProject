#include "SmartUIEditor.h"
#include "AssetToolsModule.h"
#include "LogSmartUI.h"
#include "SmartUIBlueprint/SmartUIBlueprintAssetTypeActions.h"

#define LOCTEXT_NAMESPACE "FSmartUIEditorModule"
#include "SmartUIBlueprint.h"
#include "SmartUIBlueprint/SmartUIBlueprintCompilerContext.h"
#include "SmartUIBlueprint/SmartUIBlueprintCompiler.h"

TSharedPtr<FKismetCompilerContext> GetCompilerForNoesisBlueprint(UBlueprint* Blueprint, FCompilerResultsLog& Results, const FKismetCompilerOptions& CompilerOptions)
{
	USmartUIBlueprint* NoesisBlueprint = CastChecked<USmartUIBlueprint>(Blueprint);
	return TSharedPtr<FKismetCompilerContext>(new FSmartUIBlueprintCompilerContext(NoesisBlueprint, Results, CompilerOptions));
}

void FSmartUIEditorModule::StartupModule()
{
	IAssetTools& AssetTools = FModuleManager::LoadModuleChecked<FAssetToolsModule>("AssetTools").Get();

	EAssetTypeCategories::Type Category = AssetTools.RegisterAdvancedAssetCategory(FName(TEXT("SmartUIWorks")),
		LOCTEXT("SmartUIWorksCategory", "SmartUIWorks"));
	TestBlueprintAssetTypeActions = MakeShareable(new FSmartUIBlueprintAssetTypeActions(Category));
	AssetTools.RegisterAssetTypeActions(TestBlueprintAssetTypeActions.ToSharedRef());

	// Register blueprint compiler
	SmartUIBlueprintCompiler = MakeShareable(new FSmartUIBlueprintCompiler());
	IKismetCompilerInterface& KismetCompilerModule = FModuleManager::LoadModuleChecked<IKismetCompilerInterface>("KismetCompiler");
	KismetCompilerModule.GetCompilers().Insert(SmartUIBlueprintCompiler.Get(), 0); // Make sure our compiler goes before the WidgetBlueprint compiler
	FKismetCompilerContext::RegisterCompilerForBP(USmartUIBlueprint::StaticClass(), &GetCompilerForNoesisBlueprint);
}

void FSmartUIEditorModule::ShutdownModule()
{
	
}

#undef LOCTEXT_NAMESPACE
    
IMPLEMENT_MODULE(FSmartUIEditorModule, SmartUIEditor)
