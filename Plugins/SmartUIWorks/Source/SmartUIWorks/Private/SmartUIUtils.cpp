#include "SmartUIUtils.h"

#include "LogSmartUI.h"
#include "HAL/PlatformFilemanager.h"
#include "GenericPlatform/GenericPlatformFile.h"
#include "Misc/Paths.h"

bool FSmartUIUtils::CopyDirectoryRecursive(const FString& SrcDir, const FString& DestDir)
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