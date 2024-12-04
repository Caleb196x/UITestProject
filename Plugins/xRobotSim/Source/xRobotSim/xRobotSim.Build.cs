// Copyright Epic Games, Inc. All Rights Reserved.

using System.IO;
using UnrealBuildTool;

public class xRobotSim : ModuleRules
{
	public xRobotSim(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = ModuleRules.PCHUsageMode.UseExplicitOrSharedPCHs;
		
		PublicIncludePaths.AddRange(
			new string[] {
				// ... add public include paths required here ...
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
				"Core",
				// ... add other public dependencies that you statically link with here ...
			}
			);
			
		
		PrivateDependencyModuleNames.AddRange(
			new string[]
			{
				"CoreUObject",
				"Engine",
				"Slate",
				"SlateCore",
				// ... add private dependencies that you statically link with here ...	
			}
			);
		
		
		DynamicallyLoadedModuleNames.AddRange(
			new string[]
			{
				// ... add any modules that your module loads dynamically here ...
			}
			);
	}

	private void AddCapnprotoLibrary()
	{
		string CapnprotoPath = Path.Combine(ModuleDirectory, "ThirdParty", "capnproto");
		PublicIncludePaths.Add(Path.Combine(CapnprotoPath, "include"));
		// add capnproto library
		if (Target.Platform == UnrealTargetPlatform.Win64)
		{
			PublicAdditionalLibraries.AddRange(new string[]
			{
				Path.Combine(CapnprotoPath, "lib", "Win64", "capnp.lib"),
				Path.Combine(CapnprotoPath, "lib", "Win64", "capnpc.lib"),
				Path.Combine(CapnprotoPath, "lib", "Win64", "capnpc-json.lib"),
				Path.Combine(CapnprotoPath, "lib", "Win64", "capnpc-rpc.lib"),
				Path.Combine(CapnprotoPath, "lib", "Win64", "capnp-websocket.lib"),
				Path.Combine(CapnprotoPath, "lib", "Win64", "kj.lib"),
				Path.Combine(CapnprotoPath, "lib", "Win64", "kj-async.lib"),
				Path.Combine(CapnprotoPath, "lib", "Win64", "kj-http.lib"),
				Path.Combine(CapnprotoPath, "lib", "Win64", "kj-test.lib"),
			});
		}
	}

	private void CompileCapnprotoCppFile(string[] CapnprotoFiles)
	{
		
	}
}
