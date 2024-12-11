using System;
using System.IO;
using UnrealBuildTool;

public class xRobotRpc : ModuleRules
{
    public xRobotRpc(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = ModuleRules.PCHUsageMode.UseExplicitOrSharedPCHs;
        AddCapnprotoLibrary();

        PublicDependencyModuleNames.AddRange(
            new string[]
            {
                "Core",
            }
        );

        PrivateDependencyModuleNames.AddRange(
            new string[]
            {
                "CoreUObject",
                "Engine",
                "Slate",
                "SlateCore"
            }
        );
    }
    
    private void AddCapnprotoLibrary()
    {
        string capnprotoPath = Path.Combine(PluginDirectory, "ThirdParty", "capnproto");
        Console.WriteLine(capnprotoPath);
        PublicIncludePaths.Add(Path.Combine(capnprotoPath, "include"));
        // add capnproto library
        if (Target.Platform == UnrealTargetPlatform.Win64)
        {
            if (Target.Configuration == UnrealTargetConfiguration.Debug ||
                Target.Configuration == UnrealTargetConfiguration.DebugGame)
            {
                PublicAdditionalLibraries.AddRange(new string[]
                {
                    Path.Combine(capnprotoPath, "lib", "Win64", "Debug", "capnp.lib"),
                    Path.Combine(capnprotoPath, "lib", "Win64", "Debug", "capnpc.lib"),
                    Path.Combine(capnprotoPath, "lib", "Win64", "Debug", "capnp-json.lib"),
                    Path.Combine(capnprotoPath, "lib", "Win64", "Debug", "capnp-rpc.lib"),
                    Path.Combine(capnprotoPath, "lib", "Win64", "Debug", "capnp-websocket.lib"),
                    Path.Combine(capnprotoPath, "lib", "Win64", "Debug", "kj.lib"),
                    Path.Combine(capnprotoPath, "lib", "Win64", "Debug", "kj-async.lib"),
                    Path.Combine(capnprotoPath, "lib", "Win64", "Debug", "kj-http.lib"),
                    Path.Combine(capnprotoPath, "lib", "Win64", "Debug", "kj-test.lib"),
                });
            }
            else if (Target.Configuration == UnrealTargetConfiguration.Development ||
                     Target.Configuration == UnrealTargetConfiguration.Shipping)
            {
                PublicAdditionalLibraries.AddRange(new string[]
                {
                    Path.Combine(capnprotoPath, "lib", "Win64", "Release", "capnp.lib"),
                    Path.Combine(capnprotoPath, "lib", "Win64", "Release", "capnpc.lib"),
                    Path.Combine(capnprotoPath, "lib", "Win64", "Release", "capnp-json.lib"),
                    Path.Combine(capnprotoPath, "lib", "Win64", "Release", "capnp-rpc.lib"),
                    Path.Combine(capnprotoPath, "lib", "Win64", "Release", "capnp-websocket.lib"),
                    Path.Combine(capnprotoPath, "lib", "Win64", "Release", "kj.lib"),
                    Path.Combine(capnprotoPath, "lib", "Win64", "Release", "kj-async.lib"),
                    Path.Combine(capnprotoPath, "lib", "Win64", "Release", "kj-http.lib"),
                    Path.Combine(capnprotoPath, "lib", "Win64", "Release", "kj-test.lib"),
                });
            }
            bUseRTTI = true;
        }
    }

    private void CompileCapnprotoCppFile(string[] CapnprotoFiles)
    {
        string CapnprotoPath = Path.Combine(ModuleDirectory, "ThirdParty", "capnproto");
        string CapnpCompilerPath = Path.Combine(CapnprotoPath, "bin", "Windows", "capnp.exe");
        
        
        
    }
}