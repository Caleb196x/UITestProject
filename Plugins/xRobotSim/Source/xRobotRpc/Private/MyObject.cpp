#include "MyObject.h"

int32 MyObject::Add(int32 a, int32 b)
{
	return a + b;
}

int32 MyObject::Sub(int32 a, int32 b)
{
	return a - b;
}

int32 MyObject::Mul(int32 a, int32 b)
{
	return a * b;
}

int32 MyObject::Div(int32 a, int32 b)
{
	if (b == 0) return 0;
	return a / b;
}



