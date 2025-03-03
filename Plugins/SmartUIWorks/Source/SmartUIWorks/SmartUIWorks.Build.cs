// Copyright Epic Games, Inc. All Rights Reserved.

using UnrealBuildTool;
using System.IO;

public class SmartUIWorks : ModuleRules
{
	public SmartUIWorks(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = ModuleRules.PCHUsageMode.UseExplicitOrSharedPCHs;
		
		PublicIncludePaths.AddRange(
			new string[] {
				// ... add public include paths required here ...
				"Programs/UnrealHeaderTool/Public",
			}
			);
				
		
		PrivateIncludePaths.AddRange(
			new string[] {
				// ... add other private include paths required here ...
			}
			);
			
		
		PublicDependencyModuleNames.AddRange(
			new string[]
			{
				"Core", "Projects",
				// ... add other public dependencies that you statically link with here ...
			}
			);
			
		
		PrivateDependencyModuleNames.AddRange(
			new string[]
			{
				"CoreUObject",
				"UMG",
				"UnrealEd",
				"LevelEditor",
				"Engine",
				"Slate",
				"SlateCore",
				"EditorStyle",
				"InputCore",
				"Projects",
				"DeclarationGenerator",
				"JsEnv"
				// ... add private dependencies that you statically link with here ...	
			}
			);
		
		
		DynamicallyLoadedModuleNames.AddRange(
			new string[]
			{
				// ... add any modules that your module loads dynamically here ...
			}
			);
		
		// string coreJSPath = Path.GetFullPath(Path.Combine(ModuleDirectory, "..", "Scripts", "JavaScript"));
		// // plugin content directory
		// string destDirName = Path.GetFullPath(Path.Combine(ModuleDirectory, "..", "..", "..", "Content", "JavaScript"));
		// DirectoryCopy(coreJSPath, destDirName, true);

		// // 每次build时拷贝一些手写的.d.ts到Typing目录以同步更新
		// string srcDtsDirName  = Path.GetFullPath(Path.Combine(ModuleDirectory, "..", "Scripts", "TypeScript"));
		// string dstDtsDirName = Path.GetFullPath(Path.Combine(ModuleDirectory, "..", "..", "Content", "TypeScript"));
		// DirectoryCopy(srcDtsDirName, dstDtsDirName, true);
	}
	
	private static void DirectoryCopy(string sourceDirName, string destDirName, bool copySubDirs)
	{
		DirectoryInfo dir = new DirectoryInfo(sourceDirName);

		if (!dir.Exists)
		{
			throw new DirectoryNotFoundException(
				"Source directory does not exist or could not be found: "
				+ sourceDirName);
		}

		if (!Directory.Exists(destDirName))
		{
			Directory.CreateDirectory(destDirName);
		}

		// Get the files in the directory and copy them to the new location.
		FileInfo[] files = dir.GetFiles();
		foreach (FileInfo file in files)
		{
			string temppath = Path.Combine(destDirName, file.Name);
			file.CopyTo(temppath, true);
		}

		if (copySubDirs)
		{
			DirectoryInfo[] dirs = dir.GetDirectories();
			foreach (DirectoryInfo subdir in dirs)
			{
				string temppath = Path.Combine(destDirName, subdir.Name);
				DirectoryCopy(subdir.FullName, temppath, copySubDirs);
			}
		}
	}
}


