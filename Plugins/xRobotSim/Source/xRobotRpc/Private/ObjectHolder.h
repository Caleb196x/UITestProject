#pragma once
#include "CoreMinimal.h"

class FObjectHolder
{
public:
	static FObjectHolder& Get()
	{
		static FObjectHolder ObjectHolder;
		return ObjectHolder;
	}

	void RegisterToRetainer(void* GrpcObj, UObject* ObjectPtr)
	{
		ObjectPtr->AddToRoot();
		UserObjectRetainer.Add(GrpcObj, ObjectPtr);
	}

	void RemoveFromRetainer(void* GrpcObj)
	{
		UObject* ObjectPtr;
		UserObjectRetainer.RemoveAndCopyValue(GrpcObj, ObjectPtr);
		ObjectPtr->RemoveFromRoot();
		
		ObjectPtr = nullptr;
	}

	UObject* GetUObject(void* GrpcObj)
	{
		if (UserObjectRetainer.Contains(GrpcObj))
		{
			return *UserObjectRetainer.Find(GrpcObj);
		}
		else
		{
			return nullptr;
		}
	}
	
private:
	TMap<void*, UObject*> UserObjectRetainer;
};
