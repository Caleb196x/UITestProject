#pragma once

#include "JsEnv.h"
#include "Blueprint/UserWidget.h"
#include "SmartUICoreWidget.generated.h"

UCLASS(BlueprintType)
class SMARTUIWORKS_API USmartUICoreWidget : public UUserWidget
{
	GENERATED_UCLASS_BODY()
public:
	UFUNCTION(BlueprintCallable, Category = "SmartUIWorks")
	UPanelSlot* AddChild(UWidget* Content);

	UFUNCTION(BlueprintCallable, Category = "SmartUIWorks")
	bool RemoveChild(UWidget* Content);

	UFUNCTION(BlueprintCallable, Category = "SmartUIWorks")
	void ReleaseJsEnv();

	UFUNCTION(BlueprintCallable, Category = "SmartUIWorks")
	FString GetWidgetName();

	UPROPERTY()
	FString WidgetName;

	// test
	UFUNCTION(BlueprintCallable, Category = "SmartUIWorks")
	void RestartJsScript();
	
	virtual void BeginDestroy() override;
private:
	void init();
	
	// js程序入口
	FString MainReactJsScriptPath;

	FString ScriptHomeDir;

	TObjectPtr<UPanelSlot> RootSlot;

	TSharedPtr<puerts::FJsEnv> JsEnv;
};
