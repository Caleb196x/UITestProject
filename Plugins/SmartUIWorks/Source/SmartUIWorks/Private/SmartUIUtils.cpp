﻿#include "SmartUIUtils.h"

#include "LogSmartUI.h"
#include "HAL/PlatformFilemanager.h"
#include "GenericPlatform/GenericPlatformFile.h"
#include "Misc/Paths.h"

bool FSmartUIUtils::CopyDirectoryRecursive(const FString& SrcDir, const FString& DestDir, const TArray<FString>& SkipExistFiles)
{
	IPlatformFile& PlatformFile = FPlatformFileManager::Get().GetPlatformFile();

	// 创建目标目录
	if (!PlatformFile.CreateDirectoryTree(*DestDir))
	{
		UE_LOG(LogSmartUI, Error, TEXT("Failed to create destination directory: %s"), *DestDir);
		return false;
	}

	// 遍历源目录
	TArray<FString> FileNames;
	PlatformFile.FindFilesRecursively(FileNames, *SrcDir, TEXT(""));

	for (FString& SourcePath : FileNames)
	{
		// 构建目标路径
		FString RelativePath = SourcePath;
		FPaths::MakePathRelativeTo(RelativePath, *SrcDir);
		FString DestPath = FPaths::Combine(*DestDir, *RelativePath);

		if (CheckNameExistInArray(SkipExistFiles, RelativePath)
			&& FPaths::FileExists(DestPath))
		{
			continue;
		}

		// 创建目标子目录
		FString DestSubDir = FPaths::GetPath(DestPath);
		if (!PlatformFile.DirectoryExists(*DestSubDir))
		{
			PlatformFile.CreateDirectoryTree(*DestSubDir);
		}

		// 执行文件拷贝
		if (!PlatformFile.CopyFile(*DestPath, *SourcePath))
		{
			UE_LOG(LogSmartUI, Warning, TEXT("Failed to copy file: %s"), *SourcePath);
		}
	}

	return true;
}

bool FSmartUIUtils::DeleteDirectoryRecursive(const FString& DirPath)
{
	IPlatformFile& PlatformFile = FPlatformFileManager::Get().GetPlatformFile();
	
	if (PlatformFile.DirectoryExists(*DirPath))
	{
		// 删除目录及其内容
		return PlatformFile.DeleteDirectoryRecursively(*DirPath);
	}
	
	UE_LOG(LogSmartUI, Log, TEXT("Directory does not exist: %s"), *DirPath);
	return true;
}

bool FSmartUIUtils::CheckNameExistInArray(const TArray<FString>& SkipExistFiles, const FString& CheckName)
{
	for (const FString& FileName : SkipExistFiles)
	{
		if (FileName == CheckName)
		{
			return true;
		}

		FString NameWithoutExt = FPaths::GetCleanFilename(CheckName);
		if (FileName == NameWithoutExt)
		{
			return true;
		}
	}

	return false;
}

bool FSmartUIUtils::ReadFileContent(const FString& FilePath, FString& OutContent)
{
	if (FPaths::FileExists(FilePath))
	{
		return FFileHelper::LoadFileToString(OutContent, *FilePath);
	}
    
	UE_LOG(LogSmartUI, Error, TEXT("Failed to read file: %s (file not found)"), *FilePath);
	return false;
}