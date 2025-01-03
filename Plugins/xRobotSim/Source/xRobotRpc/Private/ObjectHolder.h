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
		GrpcObjectRetainer.Add(ObjectPtr, GrpcObj);
	}

	void RemoveFromRetainer(void* GrpcObj)
	{
		UObject* ObjectPtr;
		UserObjectRetainer.RemoveAndCopyValue(GrpcObj, ObjectPtr);
		ObjectPtr->RemoveFromRoot();
		GrpcObjectRetainer.RemoveAndCopyValue(ObjectPtr, GrpcObj);
		
		ObjectPtr = nullptr;
	}

	UObject* GetUObject(const void* GrpcObj)
	{
		if (UserObjectRetainer.Contains(GrpcObj))
		{
			return *UserObjectRetainer.Find(GrpcObj);
		}

		return nullptr;
	}

	void* GetGrpcObject(const UObject* ObjectPtr)
	{
		if (GrpcObjectRetainer.Contains(ObjectPtr))
		{
			return *GrpcObjectRetainer.Find(ObjectPtr);
		}

		return nullptr;
	}

	bool HasObject(const void* GrpcObj) const
	{
		return UserObjectRetainer.Contains(GrpcObj);
	}
	
private:
	TMap<void*, UObject*> UserObjectRetainer;
	TMap<UObject*, void*> GrpcObjectRetainer;
};
