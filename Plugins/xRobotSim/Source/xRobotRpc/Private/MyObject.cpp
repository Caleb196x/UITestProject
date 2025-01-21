#include "MyObject.h"

#include "UnrealPythonRpcLog.h"

int32 UMyObject::Add(int32 a, int32 b)
{
	UE_LOG(LogUnrealPython, Display, TEXT("a: %d, b: %d"), a, b)
	return a + b;
}

int32 UMyObject::Sub(int32 a, int32 b)
{
	return a - b;
}

int32 UMyObject::Mul(int32 a, int32 b)
{
	return a * b;
}

int32 UMyObject::Div(int32 a, int32 b)
{
	if (b == 0) return 0;
	return a / b;
}

void UMyObject::Printf(FString text)
{
	UE_LOG(LogTemp, Display, TEXT("%s"), *text)
}

void UMyObject::MTestArrayParam(UMyObject* array)
{
	UE_LOG(LogTemp, Display, TEXT("hello man!"))
}

int32 UMyObject::TestVector(FVector2D Vector)
{
	UE_LOG(LogUnrealPython, Warning, TEXT("Test vector get Vector.X: %f, Vector.Y: %f"), Vector.X, Vector.Y)
	return static_cast<int32>(Vector.X + Vector.Y);
}

void UMyObject::TestEnum(EMyEnum MyEnum)
{
	UE_LOG(LogTemp, Display, TEXT("Test UEnum enum value is %d"), MyEnum)
}
