#pragma once
#include "JsEnv.h"

class FJsEnvRuntime
{
public:
	static FJsEnvRuntime& GetInstance()
	{
		static FJsEnvRuntime Instance;
		return Instance;
	}

	explicit FJsEnvRuntime(int32 EnvPoolSize = 6, int32 DebugPort = 8086);
	~FJsEnvRuntime();
		
	bool StartJavaScript(const FString& Script, const TArray<TPair<FString, UObject*>>& Arguments) const;

	bool CheckScriptLegal(const FString& Script) const;

private:
	TMap<TSharedPtr<puerts::FJsEnv>, int32> JsRuntimeEnvPool;
};
