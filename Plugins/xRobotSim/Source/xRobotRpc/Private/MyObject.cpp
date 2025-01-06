#include "MyObject.h"

int32 UMyObject::Add(int32 a, int32 b)
{
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


