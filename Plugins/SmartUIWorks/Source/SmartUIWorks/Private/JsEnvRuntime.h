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

	FJsEnvRuntime(int32 EnvPoolSize = 1, int32 DebugPort = 8086);
	~FJsEnvRuntime();

	TSharedPtr<puerts::FJsEnv> GetFreeJsEnv();
		
	bool StartJavaScript(const TSharedPtr<puerts::FJsEnv>& JsEnv, const FString& Script, const TArray<TPair<FString, UObject*>>& Arguments) const;

	bool CheckScriptLegal(const FString& Script) const;

	void ReleaseJsEnv(TSharedPtr<puerts::FJsEnv> JsEnv);

private:
	TMap<TSharedPtr<puerts::FJsEnv>, int32> JsRuntimeEnvPool;
};
