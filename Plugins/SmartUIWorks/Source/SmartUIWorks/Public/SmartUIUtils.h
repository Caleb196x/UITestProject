﻿#pragma once
#include "Interfaces/IPluginManager.h"

class SMARTUIWORKS_API FSmartUIUtils
{
public:
	/**
	 * Recursively copy all files and subdirectories under SrcDir to DestDir,
	 * and check if the files exist based on SkipExistFiles. If they exist, skip copy overwrite
	 * @param SrcDir Copy source directory
	 * @param DestDir destination directory
	 * @param SkipExistFiles Skip copied files when they exist,
	 *						the content is the relative path to SrcDir which can be without a suffix
	 * @return 
	 */
	static bool CopyDirectoryRecursive(const FString& SrcDir, const FString& DestDir, const TArray<FString>& SkipExistFiles = {});
	
	FORCEINLINE static FString GetPluginContentDir()
	{
		return FPaths::ConvertRelativePathToFull(IPluginManager::Get().FindPlugin("SmartUIWorks")->GetContentDir());
	}

	static bool DeleteDirectoryRecursive(const FString& DirPath);

	static bool CheckNameExistInArray(const TArray<FString>& SkipExistFiles, const FString& CheckName);
};
