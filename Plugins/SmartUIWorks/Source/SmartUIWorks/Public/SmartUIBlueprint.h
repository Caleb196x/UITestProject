#pragma once
#include "Interfaces/IPluginManager.h"

UCLASS(BlueprintType)
class USmartUIBlueprint : public UBlueprint
{
	GENERATED_UCLASS_BODY()
public:

	UPROPERTY(BlueprintType, EditAnywhere, Category = "SmartUIWorks")
	FString JsScriptHomeDir;

	UPROPERTY(BlueprintType, EditAnywhere, Category = "SmartUIWorks")
	FString TemplateFileDir;
	
	UPROPERTY(BlueprintType, EditAnywhere, Category = "SmartUIWorks")
	FString JsScriptMainFileName;

	void CopyTemplateScriptFileToHomeDir();

	FORCEINLINE static FString GetPluginContentDir()
	{
		return IPluginManager::Get().FindPlugin("SmartUIWorks")->GetContentDir();
	}

	FORCEINLINE FString GetJsScriptHomeDir()
	{
		return JsScriptHomeDir;
	}

	FORCEINLINE FString GetJsScriptMainFileShortPath()
	{
		return JsScriptHomeDir / JsScriptMainFileName;
	}

private:
	FString AssetFileName;
	
	
};
