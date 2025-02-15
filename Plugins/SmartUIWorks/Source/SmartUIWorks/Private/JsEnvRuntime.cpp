#include "JsEnvRuntime.h"

FJsEnvRuntime::FJsEnvRuntime(int32 EnvPoolSize, int32 DebugPort)
{
	for (int32 i = 0; i < EnvPoolSize; i++)
	{
		TSharedPtr<puerts::FJsEnv> JsEnv = MakeShared<puerts::FJsEnv>(
		std::make_unique<puerts::DefaultJSModuleLoader>(TEXT("JavaScript")),
		std::make_shared<puerts::FDefaultLogger>(), DebugPort);
		JsRuntimeEnvPool.Add(JsEnv, 1);
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

bool FJsEnvRuntime::StartJavaScript(const FString& Script, const TArray<TPair<FString, UObject*>>& Arguments) const
{
	// 1. check js script legal
	if (!CheckScriptLegal(Script))
	{
		return false;
	}
	
	// 2. find a free js env
	TSharedPtr<puerts::FJsEnv> JsEnv = nullptr;
	for (auto& Pair : JsRuntimeEnvPool)
	{
		if (Pair.Value == 1)
		{
			JsEnv = Pair.Key;
			break;
		}
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
	return true;
}
