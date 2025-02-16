#include "JsEnvRuntime.h"

#include "LogSmartUI.h"

FJsEnvRuntime::FJsEnvRuntime(int32 EnvPoolSize, int32 DebugPort)
{
	for (int32 i = 0; i < EnvPoolSize; i++)
	{
		TSharedPtr<puerts::FJsEnv> JsEnv = MakeShared<puerts::FJsEnv>(
		std::make_unique<puerts::DefaultJSModuleLoader>(TEXT("JavaScript")),
		std::make_shared<puerts::FDefaultLogger>(), DebugPort);
		JsRuntimeEnvPool.Add(JsEnv, 0);
	}
}

FJsEnvRuntime::~FJsEnvRuntime()
{
	for (auto& Pair : JsRuntimeEnvPool)
	{
		Pair.Key.Reset();
	}
	
	JsRuntimeEnvPool.Empty();
}

TSharedPtr<puerts::FJsEnv> FJsEnvRuntime::GetFreeJsEnv()
{
	TSharedPtr<puerts::FJsEnv> JsEnv = nullptr;
	for (auto& Pair : JsRuntimeEnvPool)
	{
		if (Pair.Value == 0)
		{
			JsEnv = Pair.Key;
			Pair.Value = 1;
			break;
		}
	}

	return JsEnv;
}

bool FJsEnvRuntime::StartJavaScript(const TSharedPtr<puerts::FJsEnv>& JsEnv, const FString& Script, const TArray<TPair<FString, UObject*>>& Arguments) const
{
	// 1. check js script legal
	if (!CheckScriptLegal(Script))
	{
		return false;
	}
	
	// 3. start js execute
	if (JsEnv)
	{
		JsEnv->Start(Script, Arguments);
		return true;
	}

	return false;
}

bool FJsEnvRuntime::CheckScriptLegal(const FString& Script) const
{
	if (!FPaths::FileExists(Script))
	{
		UE_LOG(LogSmartUI, Error, TEXT("can't find script: %s"), *Script);
		return false;
	}
	
	return true;
}

void FJsEnvRuntime::ReleaseJsEnv(TSharedPtr<puerts::FJsEnv> JsEnv)
{
	for (auto& Pair : JsRuntimeEnvPool)
	{
		auto Key = Pair.Key;
		if (Key.Get() == JsEnv.Get())
		{
			JsEnv->Release();
			Pair.Value = 0;
			break;
		}
	}
}