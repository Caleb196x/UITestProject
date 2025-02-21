#include "JsBridgeCaller.h"

TMap<FString, UJsBridgeCaller*> UJsBridgeCaller::SelfHolder = {};

void UJsBridgeCaller::RegisterAllocatedBrideCaller(FString CallerName, UJsBridgeCaller* Caller)
{
	if (!SelfHolder.Contains(CallerName))
	{
		SelfHolder.Add(CallerName, Caller);
	}
}

bool UJsBridgeCaller::ExecuteMainCaller(const FString& CallerName, USmartUICoreWidget* CoreWidget)
{
	if (SelfHolder.Contains(CallerName))
	{
		const UJsBridgeCaller* BridgeCaller = SelfHolder[CallerName];
		return BridgeCaller->MainCaller.ExecuteIfBound(CoreWidget);
	}

	return false;
}

bool UJsBridgeCaller::IsExistBridgeCaller(const FString& CallerName)
{
	return SelfHolder.Contains(CallerName);
}

UJsBridgeCaller* UJsBridgeCaller::AddNewBridgeCaller(const FString& CallerName)
{
	if (!SelfHolder.Contains(CallerName))
	{
		UJsBridgeCaller* Caller = NewObject<UJsBridgeCaller>();
		Caller->AddToRoot();
		SelfHolder.Add(CallerName, Caller);
		return Caller;
	}

	return SelfHolder[CallerName];
}

void UJsBridgeCaller::RemoveBridgeCaller(const FString& CallerName)
{
	if (SelfHolder.Contains(CallerName))
	{
		UJsBridgeCaller* RemoveCaller = nullptr;
		SelfHolder.RemoveAndCopyValue(CallerName, RemoveCaller);
		RemoveCaller->RemoveFromRoot();
	}
	
}

void UJsBridgeCaller::ClearAllBridgeCaller()
{
	for (auto Self : SelfHolder)
	{
		Self.Value->RemoveFromRoot();
	}
	
	SelfHolder.Empty();
}