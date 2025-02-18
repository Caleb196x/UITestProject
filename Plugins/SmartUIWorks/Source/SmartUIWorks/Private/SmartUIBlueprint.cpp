#include "SmartUIBlueprint.h"
#include "LogSmartUI.h"
#include "SmartUIBlueprintGeneratedClass.h"
#include "Utils.h"

USmartUIBlueprint::USmartUIBlueprint(const FObjectInitializer& ObjectInitializer)
: Super(ObjectInitializer)
{
	WidgetName = GetName();
	
	JsScriptHomeDir = TEXT("Main") / WidgetName;
	TemplateFileDir = FPaths::Combine(TEXT("Template"), TEXT("smart_ui/"));
	JsScriptMainFileName = TEXT("main");

	if (!WidgetName.StartsWith("Default__"))
	{
		CopyTemplateScriptFileToHomeDir();
	}
	
}

void USmartUIBlueprint::CopyTemplateScriptFileToHomeDir()
{
	FString PluginContentDir = GetPluginContentDir();

	const FString JsScriptHomeDirFullPath = FPaths::Combine(PluginContentDir, TEXT("TypeScript"), JsScriptHomeDir);
	const FString TemplateFileDirFullPath = FPaths::Combine(PluginContentDir, TEXT("TypeScript"), TemplateFileDir);

	if (!FPaths::DirectoryExists(TemplateFileDirFullPath))
	{
		UE_LOG(LogSmartUI, Error, TEXT("Not exist smart ui template javascript files %s"), *TemplateFileDirFullPath);
		return;
	}
	
	if (!FPaths::DirectoryExists(JsScriptHomeDirFullPath))
	{
		IFileManager::Get().MakeDirectory(*JsScriptHomeDirFullPath);
	}

	if (!FUtils::CopyDirectoryRecursive(TemplateFileDirFullPath, JsScriptHomeDirFullPath))
	{
		UE_LOG(LogSmartUI, Error, TEXT("Copy template script files %s to %s failed."), *TemplateFileDirFullPath, *JsScriptHomeDirFullPath);
	}
}

#if WITH_EDITOR
UClass* USmartUIBlueprint::GetBlueprintClass() const
{
	return USmartUIBlueprintGeneratedClass::StaticClass();
}

bool USmartUIBlueprint::SupportedByDefaultBlueprintFactory() const
{
	return false;
}
#endif