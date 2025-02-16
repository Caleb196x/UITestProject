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

	virtual void BeginDestroy() override;
private:
	void init();
	// js程序入口
	FString MainReactJsScriptPath;

	TObjectPtr<UPanelSlot> RootSlot;

	TSharedPtr<puerts::FJsEnv> JsEnv;
};
