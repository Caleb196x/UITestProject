#include "SmartUIBlueprint.h"

#include "LogSmartUI.h"

USmartUIBlueprint::USmartUIBlueprint(const FObjectInitializer& ObjectInitializer)
: Super(ObjectInitializer)
{
	AssetFileName = GetName();
	JsScriptHomeDir = TEXT("Main") / AssetFileName;
	TemplateFileDir = FPaths::Combine(TEXT("Template"), TEXT("smart_ui"));
	JsScriptMainFileName = TEXT("main");

	CopyTemplateScriptFileToHomeDir();
}

void USmartUIBlueprint::CopyTemplateScriptFileToHomeDir()
{
	FString PluginContentDir = GetPluginContentDir();

	const FString JsScriptHomeDirFullPath = FPaths::Combine(PluginContentDir, TEXT("JavaScript"), JsScriptHomeDir);
	const FString TemplateFileDirFullPath = FPaths::Combine(PluginContentDir, TEXT("JavaScript"), TemplateFileDir);

	if (!FPaths::DirectoryExists(TemplateFileDirFullPath))
	{
		UE_LOG(LogSmartUI, Error, TEXT("Not exist smart ui template javascript files %s"), *TemplateFileDirFullPath);
		return;
	}
	
	if (!FPaths::DirectoryExists(JsScriptHomeDirFullPath))
	{
		IFileManager::Get().MakeDirectory(*JsScriptHomeDirFullPath);
	}

	if (!IFileManager::Get().Copy(*TemplateFileDirFullPath, *JsScriptHomeDirFullPath, false))
	{
		UE_LOG(LogSmartUI, Error, TEXT("Copy template script files %s to %s failed."), *TemplateFileDirFullPath, *JsScriptHomeDirFullPath);
	}
}
