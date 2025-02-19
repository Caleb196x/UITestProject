#pragma once
#include "CoreMinimal.h"
#include "Interfaces/IPluginManager.h"
#include "SmartUIBlueprint.generated.h"

UCLASS()
class SMARTUIWORKS_API USmartUIBlueprint : public UBlueprint
{
	GENERATED_UCLASS_BODY()
public:
	
#if WITH_EDITOR
	UClass* GetBlueprintClass() const;
	bool SupportedByDefaultBlueprintFactory() const;
#endif
	
	UPROPERTY(BlueprintType, EditAnywhere, Category = "SmartUIWorks")
	FString TsScriptHomeDir;

	UPROPERTY(BlueprintType, EditAnywhere, Category = "SmartUIWorks")
	FString TemplateFileDir;
	
	UPROPERTY(BlueprintType, EditAnywhere, Category = "SmartUIWorks")
	FString JsScriptMainFileName;

	UPROPERTY(BlueprintType, BlueprintReadOnly, Category = "SmartUIWorks")
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
	virtual bool Rename(const TCHAR* NewName = nullptr, UObject* NewOuter = nullptr, ERenameFlags Flags = REN_None) override;

	void CopyTemplateScriptFileToHomeDir();

	void RenameScriptDir(const TCHAR* NewName);

	void RegisterBlueprintDeleteHandle();
};
