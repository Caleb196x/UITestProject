#include "SmartUIBlueprint.h"
#include "LogSmartUI.h"
#include "SmartUIBlueprintGeneratedClass.h"
#include "SmartUIUtils.h"
#include "AssetRegistry/AssetRegistryModule.h"

USmartUIBlueprint::USmartUIBlueprint(const FObjectInitializer& ObjectInitializer)
: Super(ObjectInitializer)
{
	WidgetName = GetName();
	
	TsScriptHomeDir = TEXT("Main") / WidgetName;
	TemplateFileDir = FPaths::Combine(TEXT("Template"), TEXT("smart_ui/"));
	JsScriptMainFileName = TEXT("main");

#if WITH_EDITOR
	if (!WidgetName.StartsWith("Default__"))
	{
		CopyTemplateScriptFileToHomeDir();
	}

	RegisterBlueprintDeleteHandle();
#endif
}

#if WITH_EDITOR
void USmartUIBlueprint::CopyTemplateScriptFileToHomeDir()
{
	FString PluginContentDir = FSmartUIUtils::GetPluginContentDir();

	const FString TsScriptHomeDirFullPath = FPaths::Combine(PluginContentDir, TEXT("TypeScript"), TsScriptHomeDir);
	const FString TemplateFileDirFullPath = FPaths::Combine(PluginContentDir, TEXT("TypeScript"), TemplateFileDir);

	if (!FPaths::DirectoryExists(TemplateFileDirFullPath))
	{
		UE_LOG(LogSmartUI, Error, TEXT("Not exist smart ui template javascript files %s"), *TemplateFileDirFullPath);
		return;
	}
	
	if (!FPaths::DirectoryExists(TsScriptHomeDirFullPath))
	{
		IFileManager::Get().MakeDirectory(*TsScriptHomeDirFullPath);
	}

	if (!FSmartUIUtils::CopyDirectoryRecursive(TemplateFileDirFullPath, TsScriptHomeDirFullPath))
	{
		UE_LOG(LogSmartUI, Error, TEXT("Copy template script files %s to %s failed."), *TemplateFileDirFullPath, *TsScriptHomeDirFullPath);
	}
}

bool USmartUIBlueprint::Rename(const TCHAR* NewName, UObject* NewOuter, ERenameFlags Flags)
{
	bool Res = Super::Rename(NewName, NewOuter, Flags);
	WidgetName = FString(NewName);
	RenameScriptDir(NewName);
	
	return Res;
}

void USmartUIBlueprint::RenameScriptDir(const TCHAR* NewName)
{
	if (NewName == nullptr)
	{
		// do nothing
		return;
	}

	FString NewTsScriptHomeDir = TEXT("Main") / WidgetName;
	if (NewTsScriptHomeDir.Equals(TsScriptHomeDir))
	{
		return;
	}
	
	FString PluginContentDir = FSmartUIUtils::GetPluginContentDir();
	const FString OldTsScriptHomeDirFullPath = FPaths::Combine(PluginContentDir, TEXT("TypeScript"), TsScriptHomeDir);
	const FString OldJsScriptHomeDirFullPath = FPaths::Combine(PluginContentDir, TEXT("JavaScript"), TsScriptHomeDir);

	const FString NewTsScriptHomeDirFullPath = FPaths::Combine(PluginContentDir, TEXT("TypeScript"), NewTsScriptHomeDir);
	const FString NewJsScriptHomeDirFullPath = FPaths::Combine(PluginContentDir, TEXT("JavaScript"), NewTsScriptHomeDir);

	if (FPaths::DirectoryExists(OldTsScriptHomeDirFullPath))
	{
		IFileManager::Get().Move(*NewTsScriptHomeDirFullPath,*OldTsScriptHomeDirFullPath);
	}
	else
	{
		UE_LOG(LogSmartUI, Warning, TEXT("Not exist %s rename to %s failed"), *OldTsScriptHomeDirFullPath, *NewTsScriptHomeDirFullPath)
	}

	if (FPaths::DirectoryExists(OldJsScriptHomeDirFullPath))
	{
		IFileManager::Get().Move(*NewJsScriptHomeDirFullPath,*OldJsScriptHomeDirFullPath);
	}
	else
	{
		UE_LOG(LogSmartUI, Warning, TEXT("Not exist %s rename to %s failed"), *OldJsScriptHomeDirFullPath, *NewJsScriptHomeDirFullPath)
	}

	TsScriptHomeDir = NewTsScriptHomeDir;
}

void USmartUIBlueprint::RegisterBlueprintDeleteHandle()
{
	IAssetRegistry& AssetRegistry = FModuleManager::LoadModuleChecked<FAssetRegistryModule>("AssetRegistry").Get();
	
	AssetRegistry.OnAssetRemoved().AddLambda([this](const FAssetData& AssetData)
	{
		const FName AssetName = AssetData.AssetName;
		if (this->GetFName() == AssetName)
		{
			FString PluginContentDir = FSmartUIUtils::GetPluginContentDir();
			const FString TsScriptHomeDirFullPath = FPaths::Combine(PluginContentDir, TEXT("TypeScript"), TsScriptHomeDir);
			if (FPaths::DirectoryExists(TsScriptHomeDirFullPath))
			{
				if (!FSmartUIUtils::DeleteDirectoryRecursive(TsScriptHomeDirFullPath))
				{
					UE_LOG(LogSmartUI, Warning, TEXT("Delete %s failed"), *TsScriptHomeDirFullPath);
				}
				else
				{
					UE_LOG(LogSmartUI, Log, TEXT("Delete %s success when delete smartui blueprint %s"), *TsScriptHomeDirFullPath, *AssetName.ToString());
				}
			}

			const FString JsScriptHomeDirFullPath = FPaths::Combine(PluginContentDir, TEXT("JavaScript"), TsScriptHomeDir);
			if (FPaths::DirectoryExists(JsScriptHomeDirFullPath))
			{
				if (!FSmartUIUtils::DeleteDirectoryRecursive(JsScriptHomeDirFullPath))
				{
					UE_LOG(LogSmartUI, Warning, TEXT("Delete %s failed"), *JsScriptHomeDirFullPath);
				}
				else
				{
					UE_LOG(LogSmartUI, Log, TEXT("Delete %s success when delete smartui blueprint %s"), *JsScriptHomeDirFullPath, *AssetName.ToString());
				}
			}
			
		}
	});
}

UClass* USmartUIBlueprint::GetBlueprintClass() const
{
	return USmartUIBlueprintGeneratedClass::StaticClass();
}

bool USmartUIBlueprint::SupportedByDefaultBlueprintFactory() const
{
	return false;
}

#endif
