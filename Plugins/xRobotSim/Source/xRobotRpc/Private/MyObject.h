#pragma once
#include <string>

#include "MyObject.generated.h"

UCLASS()
class UMyObject : public UObject
{
	GENERATED_BODY()
public:
	UFUNCTION(BlueprintCallable, meta = (DisplayName = "Add", ScriptName = "Add"), Category="Test")
	int32 Add(int32 a, int32 b);

	UFUNCTION(BlueprintCallable, meta = (DisplayName = "Sub", ScriptName = "Sub"), Category="Test")
	int32 Sub(int32 a, int32 b);

	UFUNCTION(BlueprintCallable, meta = (DisplayName = "Mul", ScriptName = "Mul"), Category="Test")
	int32 Mul(int32 a, int32 b);

	UFUNCTION(BlueprintCallable, meta = (DisplayName = "Div", ScriptName = "Div"), Category="Test")
	int32 Div(int32 a, int32 b);

	UFUNCTION(BlueprintCallable, meta = (DisplayName = "Printf", ScriptName = "Printf"), Category="Test")
	static void Printf(FString text);

	UFUNCTION(BlueprintCallable, meta = (DisplayName = "MTestArrayParam", ScriptName = "MTestArrayParam"), Category="Test")
	void MTestArrayParam(UMyObject* array);
};
