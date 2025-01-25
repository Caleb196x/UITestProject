#pragma once
#include "CoreMinimal.h"
#include "CoreRpcUtils.h"
#include "StructTypeAdapter.h"
#include "ContainerTypeAdapter.h"

class FObjectHolder
{
public:
	static FObjectHolder& Get()
	{
		static FObjectHolder ObjectHolder;
		return ObjectHolder;
	}

	struct FUEObject
	{
		FString MetaTypeName; // UE反射类型
		FString ClassName;
		void* Ptr;
	};

	FUEObject* RegisterToRetainer(void* RpcClientObj, void* ObjectPtr, const FString& MetaType, const FString& ClassName)
	{
		const FUEObject UEObject {MetaType, ClassName, ObjectPtr};
		if (MetaType.Equals("UClass"))
		{
			UObject* Obj = static_cast<UObject*>(ObjectPtr);
			Obj->AddToRoot();
		}
		
		UserObjectRetainer.Add(RpcClientObj, UEObject);
		GrpcObjectRetainer.Add(ObjectPtr, RpcClientObj);

		return UserObjectRetainer.Find(RpcClientObj);
	}

	void RemoveFromRetainer(void* RpcClientObj)
	{
		FUEObject UEObject;
		UserObjectRetainer.RemoveAndCopyValue(RpcClientObj, UEObject);
		
		if (UEObject.MetaTypeName.Equals("UClass"))
		{
			UObject* ObjectPtr = static_cast<UObject*>(UEObject.Ptr);
			ObjectPtr->RemoveFromRoot();
		}
		else if (UEObject.MetaTypeName.Equals("UScriptStruct"))
		{
			if (const FStructTypeAdapter* TypeContainer = FCoreUtils::GetUEStructType(UEObject.ClassName))
			{
				
				FScriptStructTypeAdapter::Free(TypeContainer->GetStruct(), UEObject.Ptr);
			}
		}
		else if (UEObject.MetaTypeName.Equals("Container"))
		{
			if (!FContainerTypeAdapter::DestroyContainer(UEObject.Ptr, UEObject.ClassName))
			{
				UE_LOG(LogUnrealPython, Error, TEXT("Unrecognized container type %s, destory container fail."), *UEObject.ClassName);
			}
		}
		
		GrpcObjectRetainer.RemoveAndCopyValue(UEObject.Ptr, RpcClientObj);
	}

	FUEObject* GetUObject(const void* RpcClientObj)
	{
		if (UserObjectRetainer.Contains(RpcClientObj))
		{
			
			return UserObjectRetainer.Find(RpcClientObj);
		}

		return nullptr;
	}

	void* GetGrpcObject(const void* ObjectPtr)
	{
		if (GrpcObjectRetainer.Contains(ObjectPtr))
		{
			return *GrpcObjectRetainer.Find(ObjectPtr);
		}

		return nullptr;
	}

	void* GetGrpcObject(const FUEObject* ObjectPtr)
	{
		const void* Obj = ObjectPtr->Ptr;
		if (GrpcObjectRetainer.Contains(Obj))
		{
			return GrpcObjectRetainer.FindChecked(Obj);
		}

		return nullptr;
	}

	bool HasObject(const void* RpcClientObj) const
	{
		return UserObjectRetainer.Contains(RpcClientObj);
	}
	
private:
	TMap<void*, FUEObject> UserObjectRetainer;
	TMap<void*, void*> GrpcObjectRetainer;
};
