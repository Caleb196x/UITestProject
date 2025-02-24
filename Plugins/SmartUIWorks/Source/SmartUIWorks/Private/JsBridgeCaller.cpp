﻿#include "JsBridgeCaller.h"

#include "LogSmartUI.h"

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

void PrintSelfHolder(const TMap<FString, UJsBridgeCaller*>& SelfHolder)
{
	UE_LOG(LogSmartUI, Log, TEXT("===== TMap Contents map address %p ====="), &SelfHolder);
    
	// 使用C++11范围for循环遍历
	for (const auto& KeyValuePair : SelfHolder)
	{
		// 将指针地址转换为十六进制字符串
		const uint64 PointerAddress = reinterpret_cast<uint64>(KeyValuePair.Value);
		const FString PointerString = FString::Printf(TEXT("0x%016llX"), PointerAddress);

		UE_LOG(LogSmartUI, Log, TEXT("Key: %-20s | Value Pointer: %s"), 
			*KeyValuePair.Key, 
			*PointerString);
	}

	UE_LOG(LogSmartUI, Log, TEXT("===== Total Entries: %d ====="), SelfHolder.Num());
}

UJsBridgeCaller* UJsBridgeCaller::AddNewBridgeCaller(const FString& CallerName)
{
	UE_LOG(LogSmartUI, Warning, TEXT("Before add "))
	PrintSelfHolder(SelfHolder);
	if (!SelfHolder.Contains(CallerName))
	{
		UJsBridgeCaller* Caller = NewObject<UJsBridgeCaller>();
		Caller->AddToRoot();
		SelfHolder.Add(CallerName, Caller);
		UE_LOG(LogSmartUI, Warning, TEXT("After add "))
		PrintSelfHolder(SelfHolder);
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