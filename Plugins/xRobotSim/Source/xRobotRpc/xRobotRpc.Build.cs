using System.IO;
using UnrealBuildTool;

public class xRobotRpc : ModuleRules
{
    public xRobotRpc(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = ModuleRules.PCHUsageMode.UseExplicitOrSharedPCHs;

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
        string CapnprotoPath = Path.Combine(ModuleDirectory, "ThirdParty", "capnproto");
        string CapnpCompilerPath = Path.Combine(CapnprotoPath, "bin", "Windows", "capnp.exe");
        
        
        
    }
}