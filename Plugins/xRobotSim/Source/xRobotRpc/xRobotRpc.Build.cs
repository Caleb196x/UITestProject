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
            PublicAdditionalLibraries.AddRange(new string[]
            {
                Path.Combine(capnprotoPath, "lib", "Win64", "capnp.lib"),
                Path.Combine(capnprotoPath, "lib", "Win64", "capnpc.lib"),
                Path.Combine(capnprotoPath, "lib", "Win64", "capnp-json.lib"),
                Path.Combine(capnprotoPath, "lib", "Win64", "capnp-rpc.lib"),
                Path.Combine(capnprotoPath, "lib", "Win64", "capnp-websocket.lib"),
                Path.Combine(capnprotoPath, "lib", "Win64", "kj.lib"),
                Path.Combine(capnprotoPath, "lib", "Win64", "kj-async.lib"),
                Path.Combine(capnprotoPath, "lib", "Win64", "kj-http.lib"),
                Path.Combine(capnprotoPath, "lib", "Win64", "kj-test.lib"),
            });
            
            // PublicDefinitions.Add("__clang__=0");
            // PublicDefinitions.Add("__linux__=0");
            // PublicDefinitions.Add("__GNUC__=0");
            // PublicDefinitions.Add("_MSC_VER=1930");
            // PublicDefinitions.Add("warning=pragma message");
            bUseRTTI = true;
        }
    }

    private void CompileCapnprotoCppFile(string[] CapnprotoFiles)
    {
        string CapnprotoPath = Path.Combine(ModuleDirectory, "ThirdParty", "capnproto");
        string CapnpCompilerPath = Path.Combine(CapnprotoPath, "bin", "Windows", "capnp.exe");
        
        
        
    }
}