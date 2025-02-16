using UnrealBuildTool;

public class SmartUIEditor : ModuleRules
{
    public SmartUIEditor(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = ModuleRules.PCHUsageMode.UseExplicitOrSharedPCHs;

        PublicDependencyModuleNames.AddRange(
            new string[]
            {
                "Core",
                "UnrealEd",
            }
        );

        PrivateDependencyModuleNames.AddRange(
            new string[]
            {
                "CoreUObject",
                "Engine",
                "Slate",
                "SlateCore", 
                "SmartUIWorks",
                "JsEnv",
                "AssetRegistry",
                "KismetCompiler",
                "Kismet",
                "UMG"
            }
        );
    }
}