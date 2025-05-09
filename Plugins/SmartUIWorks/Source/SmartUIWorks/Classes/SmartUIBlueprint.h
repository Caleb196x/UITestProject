#pragma once
#include "CoreMinimal.h"
#include "Interfaces/IPluginManager.h"
#include "SmartUIBlueprint.generated.h"

UCLASS()
class SMARTUIWORKS_API USmartUIBlueprint : public UBlueprint
{
	GENERATED_UCLASS_BODY()
	
	UPROPERTY(BlueprintType, EditAnywhere, Category = "SmartUIWorks")
	FString TsScriptHomeDir;

	UPROPERTY(BlueprintType, EditAnywhere, Category = "SmartUIWorks")
	FString TemplateFileDir;
	
	UPROPERTY(BlueprintType, EditAnywhere, Category = "SmartUIWorks")
	FString JsScriptMainFileName;

	UPROPERTY(BlueprintType, EditAnywhere, BlueprintReadWrite, Category = "SmartUIWorks")
	FString WidgetName;

	FORCEINLINE FString GetTsScriptHomeDir()
	{
		return TsScriptHomeDir;
	}

	FORCEINLINE FString GetTsScriptMainFileShortPath()
	{
		return TsScriptHomeDir / JsScriptMainFileName;
	}

protected:
#if WITH_EDITOR
	virtual bool Rename(const TCHAR* NewName = nullptr, UObject* NewOuter = nullptr, ERenameFlags Flags = REN_None) override;

	void CopyTemplateScriptFileToHomeDir();

	void RenameScriptDir(const TCHAR* NewName);

	void RegisterBlueprintDeleteHandle();
	
	UClass* GetBlueprintClass() const;
	bool SupportedByDefaultBlueprintFactory() const;
#endif
};
