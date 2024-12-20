#pragma once

#include "MyObject.generated.h"

class UMyObject : public UObject
{
public:
	UFUNCTION(BlueprintCallable, meta = (DisplayName = "Add", ScriptName = "Add"), Category="Test")
	int32 Add(int32 a, int32 b);

	UFUNCTION(BlueprintCallable, meta = (DisplayName = "Sub", ScriptName = "Sub"), Category="Test")
	int32 Sub(int32 a, int32 b);

	UFUNCTION(BlueprintCallable, meta = (DisplayName = "Mul", ScriptName = "Mul"), Category="Test")
	int32 Mul(int32 a, int32 b);

	UFUNCTION(BlueprintCallable, meta = (DisplayName = "Div", ScriptName = "Div"), Category="Test")
	int32 Div(int32 a, int32 b);
};
