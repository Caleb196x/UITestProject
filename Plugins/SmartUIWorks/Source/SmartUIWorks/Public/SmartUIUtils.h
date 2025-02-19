#pragma once
#include "Interfaces/IPluginManager.h"

class SMARTUIWORKS_API FSmartUIUtils
{
public:
	static bool CopyDirectoryRecursive(const FString& SrcDir, const FString& DestDir);


	FORCEINLINE static FString GetPluginContentDir()
	{
		return FPaths::ConvertRelativePathToFull(IPluginManager::Get().FindPlugin("SmartUIWorks")->GetContentDir());
	}
};
