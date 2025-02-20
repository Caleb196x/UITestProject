﻿#pragma once
#include "SmartUICoreWidget.h"
#include "JsBridgeCaller.generated.h"

DECLARE_DYNAMIC_DELEGATE_OneParam(FJavaScriptMainCaller, USmartUICoreWidget*, CoreWidget);

/**
 * 
 */
UCLASS(BlueprintType)
class UJsBridgeCaller :  public UObject
{
	GENERATED_BODY() 
public:
	UFUNCTION(BlueprintCallable, Category="SmartUIWorks | JsBridgetCaller")
	static void RegisterAllocatedBrideCaller(FString CallerName, UJsBridgeCaller* Caller);

	UFUNCTION(BlueprintCallable, Category="SmartUIWorks | JsBridgetCaller")
	static bool ExecuteMainCaller(const FString& CallerName, USmartUICoreWidget* CoreWidget);
	
	UPROPERTY()
	FJavaScriptMainCaller MainCaller;

	static bool IsExistBridgeCaller(const FString& CallerName);

	static UJsBridgeCaller* AddNewBridgeCaller(const FString& CallerName);

	static void RemoveBridgeCaller(const FString& CallerName);

	static void ClearAllBridgeCaller();

private:
	static TMap<FString, UJsBridgeCaller*> SelfHolder;
};
