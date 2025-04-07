/// <reference path="puerts.d.ts" />
declare module "ue" {
    import {$Ref, $Nullable} from "puerts"

    import * as cpp from "cpp"

    import * as UE from "ue"

// __TYPE_DECL_START: A0AD22D447F99B83A9A31C9B9426B5C0
    namespace Game.StarterContent.Blueprints.Blueprint_Effect_Fire {
        class Blueprint_Effect_Fire_C extends UE.Actor {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            ["Fire Audio"]: UE.AudioComponent;
            P_Fire: UE.ParticleSystemComponent;
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): Blueprint_Effect_Fire_C;
            static Load(InName: string): Blueprint_Effect_Fire_C;
        
            __tid_Blueprint_Effect_Fire_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 2678356F40E4E16306BDD687933AE2D1
    namespace Game.StarterContent.Blueprints.Blueprint_Effect_Smoke {
        class Blueprint_Effect_Smoke_C extends UE.Actor {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            ["Smoke Audio"]: UE.AudioComponent;
            P_Smoke: UE.ParticleSystemComponent;
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): Blueprint_Effect_Smoke_C;
            static Load(InName: string): Blueprint_Effect_Smoke_C;
        
            __tid_Blueprint_Effect_Smoke_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 0D94FA604928B24E62003083BA722E3C
    namespace Game.StarterContent.Blueprints.Blueprint_Effect_Sparks {
        class Blueprint_Effect_Sparks_C extends UE.Actor {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            ["Sparks Audio"]: UE.AudioComponent;
            Sparks: UE.ParticleSystemComponent;
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): Blueprint_Effect_Sparks_C;
            static Load(InName: string): Blueprint_Effect_Sparks_C;
        
            __tid_Blueprint_Effect_Sparks_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 62110038444C84D1EC760AB254B78A07
    namespace Game.StarterContent.Blueprints.Blueprint_Effect_Steam {
        class Blueprint_Effect_Steam_C extends UE.Actor {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            ["Steam AUdio"]: UE.AudioComponent;
            P_Steam_Lit: UE.ParticleSystemComponent;
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): Blueprint_Effect_Steam_C;
            static Load(InName: string): Blueprint_Effect_Steam_C;
        
            __tid_Blueprint_Effect_Steam_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 819FE165412B370746C9159B51857ADC
    namespace Game.StarterContent.Blueprints.Blueprint_CeilingLight {
        class Blueprint_CeilingLight_C extends UE.Actor {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            SM_Lamp_Ceiling: UE.StaticMeshComponent;
            PointLight1: UE.PointLightComponent;
            Scene1: UE.SceneComponent;
            Brightness: number;
            Color: UE.LinearColor;
            ["Source Radius"]: number;
            /*
             *Construction script, the place to spawn components and do other setup.
             *@note Name used in CreateBlueprint function
             */
            UserConstructionScript() : void;
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): Blueprint_CeilingLight_C;
            static Load(InName: string): Blueprint_CeilingLight_C;
        
            __tid_Blueprint_CeilingLight_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 6A1AE04E46BB2DCE8E8DA5B318ECB60F
    namespace Game.StarterContent.Blueprints.Blueprint_WallSconce {
        class Blueprint_WallSconce_C extends UE.Actor {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            SM_Lamp_Wall: UE.StaticMeshComponent;
            PointLight2: UE.SpotLightComponent;
            Scene1: UE.SceneComponent;
            Brightness: number;
            Color: UE.LinearColor;
            ["Inner Cone Angle"]: number;
            ["Outer Cone Angle"]: number;
            /*
             *Construction script, the place to spawn components and do other setup.
             *@note Name used in CreateBlueprint function
             */
            UserConstructionScript() : void;
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): Blueprint_WallSconce_C;
            static Load(InName: string): Blueprint_WallSconce_C;
        
            __tid_Blueprint_WallSconce_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: A9A3CE564D0C419CD50299A434F02D25
    namespace Game.Button {
        class Button_C extends UE.UserWidget {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            UberGraphFrame: UE.PointerToUberGraphFrame;
            /*
             *Called when this entry is released from the owning table and no longer represents any list item
             */
            BP_OnEntryReleased() : void;
            /*
             *Called when the expansion state of the item represented by this entry changes. Tree view entries only.
             */
            BP_OnItemExpansionChanged(bIsExpanded: boolean) : void;
            /*
             *Called when the selection state of the item represented by this entry changes.
             */
            BP_OnItemSelectionChanged(bIsSelected: boolean) : void;
            ExecuteUbergraph_Button(EntryPoint: number) : void;
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): Button_C;
            static Load(InName: string): Button_C;
        
            __tid_Button_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 9D28DCC249612395EA47738320F0F171
    namespace Game.FirstPersonArms.Animations.FirstPerson_AnimBP {
        class AnimBlueprintGeneratedConstantData extends UE.AnimBlueprintConstantData {
            constructor();
            constructor(__NameProperty_280: string, __BoolProperty_281: boolean, __NameProperty_282: string, __IntProperty_283: number, __NameProperty_284: string, __IntProperty_285: number, __NameProperty_286: string, __IntProperty_287: number, __NameProperty_288: string, __IntProperty_289: number, __FloatProperty_290: number, __StructProperty_291: UE.InputScaleBiasClampConstants, __FloatProperty_292: number, __EnumProperty_293: UE.EAnimSyncMethod, __ByteProperty_294: UE.EAnimGroupRole, __NameProperty_295: string, __NameProperty_296: string, __NameProperty_297: string, __IntProperty_298: number, __StructProperty_299: UE.AnimNodeFunctionRef, __BlendProfile_300: UE.BlendProfile, __CurveFloat_301: UE.CurveFloat, __BoolProperty_302: boolean, __EnumProperty_303: UE.EAlphaBlendOption, __EnumProperty_304: UE.EBlendListTransitionType, __ArrayProperty_305: TArray<number>, AnimBlueprintExtension_PropertyAccess: UE.AnimSubsystem_PropertyAccess, AnimBlueprintExtension_Base: UE.AnimSubsystem_Base, AnimGraphNode_Root: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_TransitionResult_13: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_TransitionResult_12: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_TransitionResult_11: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_TransitionResult_10: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_TransitionResult_9: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_TransitionResult_8: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_TransitionResult_7: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_SequencePlayer_9: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_StateResult_9: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_SequencePlayer_8: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_StateResult_8: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_SequencePlayer_7: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_StateResult_7: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_SequencePlayer_6: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_StateResult_6: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_SequencePlayer_5: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_StateResult_5: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_StateMachine_1: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_Slot: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_SaveCachedPose_1: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_TransitionResult_6: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_TransitionResult_5: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_TransitionResult_4: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_TransitionResult_3: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_TransitionResult_2: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_TransitionResult_1: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_TransitionResult: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_SequencePlayer_4: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_StateResult_4: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_SequencePlayer_3: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_StateResult_3: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_SequencePlayer_2: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_StateResult_2: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_SequencePlayer_1: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_StateResult_1: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_SequencePlayer: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_StateResult: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_StateMachine: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_SaveCachedPose: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_UseCachedPose_1: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_UseCachedPose: UE.AnimNodeExposedValueHandler_PropertyAccess, AnimGraphNode_BlendListByBool: UE.AnimNodeExposedValueHandler_PropertyAccess);
            __NameProperty_280: string;
            __BoolProperty_281: boolean;
            __NameProperty_282: string;
            __IntProperty_283: number;
            __NameProperty_284: string;
            __IntProperty_285: number;
            __NameProperty_286: string;
            __IntProperty_287: number;
            __NameProperty_288: string;
            __IntProperty_289: number;
            __FloatProperty_290: number;
            __StructProperty_291: UE.InputScaleBiasClampConstants;
            __FloatProperty_292: number;
            __EnumProperty_293: UE.EAnimSyncMethod;
            __ByteProperty_294: UE.EAnimGroupRole;
            __NameProperty_295: string;
            __NameProperty_296: string;
            __NameProperty_297: string;
            __IntProperty_298: number;
            __StructProperty_299: UE.AnimNodeFunctionRef;
            __BlendProfile_300: UE.BlendProfile;
            __CurveFloat_301: UE.CurveFloat;
            __BoolProperty_302: boolean;
            __EnumProperty_303: UE.EAlphaBlendOption;
            __EnumProperty_304: UE.EBlendListTransitionType;
            __ArrayProperty_305: TArray<number>;
            AnimBlueprintExtension_PropertyAccess: UE.AnimSubsystem_PropertyAccess;
            AnimBlueprintExtension_Base: UE.AnimSubsystem_Base;
            AnimGraphNode_Root: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_TransitionResult_13: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_TransitionResult_12: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_TransitionResult_11: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_TransitionResult_10: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_TransitionResult_9: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_TransitionResult_8: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_TransitionResult_7: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_SequencePlayer_9: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_StateResult_9: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_SequencePlayer_8: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_StateResult_8: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_SequencePlayer_7: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_StateResult_7: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_SequencePlayer_6: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_StateResult_6: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_SequencePlayer_5: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_StateResult_5: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_StateMachine_1: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_Slot: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_SaveCachedPose_1: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_TransitionResult_6: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_TransitionResult_5: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_TransitionResult_4: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_TransitionResult_3: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_TransitionResult_2: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_TransitionResult_1: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_TransitionResult: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_SequencePlayer_4: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_StateResult_4: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_SequencePlayer_3: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_StateResult_3: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_SequencePlayer_2: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_StateResult_2: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_SequencePlayer_1: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_StateResult_1: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_SequencePlayer: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_StateResult: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_StateMachine: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_SaveCachedPose: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_UseCachedPose_1: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_UseCachedPose: UE.AnimNodeExposedValueHandler_PropertyAccess;
            AnimGraphNode_BlendListByBool: UE.AnimNodeExposedValueHandler_PropertyAccess;
            /**
             * @deprecated use StaticStruct instead.
             */
            static StaticClass(): ScriptStruct;
            static StaticStruct(): ScriptStruct;
            __tid_AnimBlueprintGeneratedConstantData_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 9D28DCC249612395EA47738320F0F171
    namespace Game.FirstPersonArms.Animations.FirstPerson_AnimBP {
        class AnimBlueprintGeneratedMutableData extends UE.AnimBlueprintMutableData {
            constructor();
            constructor(__BoolProperty: boolean);
            __BoolProperty: boolean;
            /**
             * @deprecated use StaticStruct instead.
             */
            static StaticClass(): ScriptStruct;
            static StaticStruct(): ScriptStruct;
            __tid_AnimBlueprintGeneratedMutableData_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 9D28DCC249612395EA47738320F0F171
    namespace Game.FirstPersonArms.Animations.FirstPerson_AnimBP {
        class FirstPerson_AnimBP_C extends UE.AnimInstance {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            UberGraphFrame: UE.PointerToUberGraphFrame;
            __AnimBlueprintMutables: UE.Game.FirstPersonArms.Animations.FirstPerson_AnimBP.AnimBlueprintGeneratedMutableData;
            AnimBlueprintExtension_PropertyAccess: UE.AnimSubsystemInstance;
            AnimBlueprintExtension_Base: UE.AnimSubsystemInstance;
            AnimGraphNode_Root: UE.AnimNode_Root;
            AnimGraphNode_TransitionResult_13: UE.AnimNode_TransitionResult;
            AnimGraphNode_TransitionResult_12: UE.AnimNode_TransitionResult;
            AnimGraphNode_TransitionResult_11: UE.AnimNode_TransitionResult;
            AnimGraphNode_TransitionResult_10: UE.AnimNode_TransitionResult;
            AnimGraphNode_TransitionResult_9: UE.AnimNode_TransitionResult;
            AnimGraphNode_TransitionResult_8: UE.AnimNode_TransitionResult;
            AnimGraphNode_TransitionResult_7: UE.AnimNode_TransitionResult;
            AnimGraphNode_SequencePlayer_9: UE.AnimNode_SequencePlayer;
            AnimGraphNode_StateResult_9: UE.AnimNode_StateResult;
            AnimGraphNode_SequencePlayer_8: UE.AnimNode_SequencePlayer;
            AnimGraphNode_StateResult_8: UE.AnimNode_StateResult;
            AnimGraphNode_SequencePlayer_7: UE.AnimNode_SequencePlayer;
            AnimGraphNode_StateResult_7: UE.AnimNode_StateResult;
            AnimGraphNode_SequencePlayer_6: UE.AnimNode_SequencePlayer;
            AnimGraphNode_StateResult_6: UE.AnimNode_StateResult;
            AnimGraphNode_SequencePlayer_5: UE.AnimNode_SequencePlayer;
            AnimGraphNode_StateResult_5: UE.AnimNode_StateResult;
            AnimGraphNode_StateMachine_1: UE.AnimNode_StateMachine;
            AnimGraphNode_Slot: UE.AnimNode_Slot;
            AnimGraphNode_SaveCachedPose_1: UE.AnimNode_SaveCachedPose;
            AnimGraphNode_TransitionResult_6: UE.AnimNode_TransitionResult;
            AnimGraphNode_TransitionResult_5: UE.AnimNode_TransitionResult;
            AnimGraphNode_TransitionResult_4: UE.AnimNode_TransitionResult;
            AnimGraphNode_TransitionResult_3: UE.AnimNode_TransitionResult;
            AnimGraphNode_TransitionResult_2: UE.AnimNode_TransitionResult;
            AnimGraphNode_TransitionResult_1: UE.AnimNode_TransitionResult;
            AnimGraphNode_TransitionResult: UE.AnimNode_TransitionResult;
            AnimGraphNode_SequencePlayer_4: UE.AnimNode_SequencePlayer;
            AnimGraphNode_StateResult_4: UE.AnimNode_StateResult;
            AnimGraphNode_SequencePlayer_3: UE.AnimNode_SequencePlayer;
            AnimGraphNode_StateResult_3: UE.AnimNode_StateResult;
            AnimGraphNode_SequencePlayer_2: UE.AnimNode_SequencePlayer;
            AnimGraphNode_StateResult_2: UE.AnimNode_StateResult;
            AnimGraphNode_SequencePlayer_1: UE.AnimNode_SequencePlayer;
            AnimGraphNode_StateResult_1: UE.AnimNode_StateResult;
            AnimGraphNode_SequencePlayer: UE.AnimNode_SequencePlayer;
            AnimGraphNode_StateResult: UE.AnimNode_StateResult;
            AnimGraphNode_StateMachine: UE.AnimNode_StateMachine;
            AnimGraphNode_SaveCachedPose: UE.AnimNode_SaveCachedPose;
            AnimGraphNode_UseCachedPose_1: UE.AnimNode_UseCachedPose;
            AnimGraphNode_UseCachedPose: UE.AnimNode_UseCachedPose;
            AnimGraphNode_BlendListByBool: UE.AnimNode_BlendListByBool;
            IsMoving: boolean;
            bIsInAir: boolean;
            HasRifle: boolean;
            FirstPersonCharacter: UE.Object;
            AnimGraph(AnimGraph: $Ref<UE.PoseLink>) : void;
            /*
             *Executed when begin play is called on the owning component
             */
            BlueprintBeginPlay() : void;
            /*
             *Executed when the Animation is updated
             */
            BlueprintUpdateAnimation(DeltaTimeX: number) : void;
            EvaluateGraphExposedInputs_ExecuteUbergraph_FirstPerson_AnimBP_AnimGraphNode_TransitionResult_274EC9B146631F45FDB52BB11F47D731() : void;
            EvaluateGraphExposedInputs_ExecuteUbergraph_FirstPerson_AnimBP_AnimGraphNode_TransitionResult_53F31B364AE1E94B7AB4B3B7BB0F164E() : void;
            EvaluateGraphExposedInputs_ExecuteUbergraph_FirstPerson_AnimBP_AnimGraphNode_TransitionResult_B902C16045F47029D8FF9A8AE4529E0E() : void;
            EvaluateGraphExposedInputs_ExecuteUbergraph_FirstPerson_AnimBP_AnimGraphNode_TransitionResult_D654D16F412EF3EFE1B50B94AB239895() : void;
            ExecuteUbergraph_FirstPerson_AnimBP(EntryPoint: number) : void;
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): FirstPerson_AnimBP_C;
            static Load(InName: string): FirstPerson_AnimBP_C;
        
            __tid_FirstPerson_AnimBP_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: F9C78A6A4764434D4FF9EC9799CFED73
    namespace Game.HahaUI {
        class HahaUI_C extends UE.SmartUICoreWidget {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): HahaUI_C;
            static Load(InName: string): HahaUI_C;
        
            __tid_HahaUI_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 6D16DC5F49703DEAFC8CD3AA6779B3C3
    namespace Game.TestSmartUI {
        class TestSmartUI_C extends UE.SmartUICoreWidget {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): TestSmartUI_C;
            static Load(InName: string): TestSmartUI_C;
        
            __tid_TestSmartUI_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 9988060047F41D16DB97DBB3449A9D64
    namespace Game.SmartUIButton {
        class SmartUIButton_C extends UE.SmartUICoreWidget {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): SmartUIButton_C;
            static Load(InName: string): SmartUIButton_C;
        
            __tid_SmartUIButton_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 6205C614415847559A6A56BFC077EF5E
    namespace Game.MyTestCreateUI_123 {
        class MyTestCreateUI_123_C extends UE.SmartUICoreWidget {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): MyTestCreateUI_123_C;
            static Load(InName: string): MyTestCreateUI_123_C;
        
            __tid_MyTestCreateUI_123_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 5DE889FB47C1F608731560A518854FD1
    namespace Game.Button1 {
        class Button1_C extends UE.UserWidget {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            UberGraphFrame: UE.PointerToUberGraphFrame;
            Button_0: UE.Button;
            CanvasPanel_157: UE.CanvasPanel;
            BndEvt__Button1_Button_0_K2Node_ComponentBoundEvent_0_OnButtonClickedEvent__DelegateSignature() : void;
            /*
             *Called when this entry is released from the owning table and no longer represents any list item
             */
            BP_OnEntryReleased() : void;
            /*
             *Called when the expansion state of the item represented by this entry changes. Tree view entries only.
             */
            BP_OnItemExpansionChanged(bIsExpanded: boolean) : void;
            /*
             *Called when the selection state of the item represented by this entry changes.
             */
            BP_OnItemSelectionChanged(bIsSelected: boolean) : void;
            ExecuteUbergraph_Button1(EntryPoint: number) : void;
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): Button1_C;
            static Load(InName: string): Button1_C;
        
            __tid_Button1_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 8648CEA446B52B4B77BBCAB3F85B162F
    namespace Game.Actor3DWidget {
        class Actor3DWidget_C extends UE.Actor {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            UberGraphFrame: UE.PointerToUberGraphFrame;
            Widget: UE.WidgetComponent;
            DefaultSceneRoot: UE.SceneComponent;
            ExecuteUbergraph_Actor3DWidget(EntryPoint: number) : void;
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): Actor3DWidget_C;
            static Load(InName: string): Actor3DWidget_C;
        
            __tid_Actor3DWidget_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 284D63AF42FEF8F7194F2F99F30710CC
    namespace Game.NewWidgetBlueprint {
        class NewWidgetBlueprint_C extends UE.UserWidget {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            UberGraphFrame: UE.PointerToUberGraphFrame;
            ButtonAnimation: UE.WidgetAnimation;
            NewAnimation: UE.WidgetAnimation;
            Button_0: UE.Button;
            Button_225: UE.Button;
            CheckBox_0: UE.CheckBox;
            CircularThrobber_136: UE.CircularThrobber;
            ComboBoxKey_102: UE.ComboBoxKey;
            ComboBoxString_45: UE.ComboBoxString;
            ExpandableArea_196: UE.ExpandableArea;
            Image_0: UE.Image;
            Image_109: UE.Image;
            InvalidationBox_422: UE.InvalidationBox;
            MultiLineEditableTextBox_209: UE.MultiLineEditableTextBox;
            RadialSlider_264: UE.RadialSlider;
            RetainerBox_560: UE.RetainerBox;
            RichTextBlock_63: UE.RichTextBlock;
            ScrollBox_186: UE.ScrollBox;
            Slider_386: UE.Slider;
            SpinBox_134: UE.SpinBox;
            Throbber_160: UE.Throbber;
            Item: string;
            BndEvt__NewWidgetBlueprint_Button_0_K2Node_ComponentBoundEvent_1_OnButtonClickedEvent__DelegateSignature() : void;
            BndEvt__NewWidgetBlueprint_Button_225_K2Node_ComponentBoundEvent_0_OnButtonClickedEvent__DelegateSignature() : void;
            BndEvt__NewWidgetBlueprint_SpinBox_134_K2Node_ComponentBoundEvent_2_OnSpinBoxValueCommittedEvent__DelegateSignature(InValue: number, CommitMethod: UE.ETextCommit) : void;
            BndEvt__NewWidgetBlueprint_SpinBox_134_K2Node_ComponentBoundEvent_3_OnSpinBoxValueChangedEvent__DelegateSignature(InValue: number) : void;
            ExecuteUbergraph_NewWidgetBlueprint(EntryPoint: number) : void;
            GetBrush() : UE.SlateBrush;
            OnGenerateContentWidget(Item: string) : UE.Widget;
            OnGenerateItemWidget(Item: string) : UE.Widget;
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): NewWidgetBlueprint_C;
            static Load(InName: string): NewWidgetBlueprint_C;
        
            __tid_NewWidgetBlueprint_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: DB93CF9541BC5B0CE09210A0E8B1CE26
    namespace Game.XmlUI.LoadingScreen.BPW_LoadingScreen {
        class BPW_LoadingScreen_C extends UE.UserWidget {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            UberGraphFrame: UE.PointerToUberGraphFrame;
            BlackBG: UE.Image;
            Image_0: UE.Image;
            DoneFadingEvent: $MulticastDelegate<() => void>;
            DoneFadingEvent__DelegateSignature() : void;
            ExecuteUbergraph_BPW_LoadingScreen(EntryPoint: number) : void;
            /*
             *Ticks this widget.  Override in derived classes, but always call the parent implementation.
             *
             *@param  MyGeometry The space allotted for this widget
             *@param  InDeltaTime  Real time passed since last tick
             */
            Tick(MyGeometry: UE.Geometry, InDeltaTime: number) : void;
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): BPW_LoadingScreen_C;
            static Load(InName: string): BPW_LoadingScreen_C;
        
            __tid_BPW_LoadingScreen_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: EED5FFDF49AE9FE3F60F449012E3A731
    namespace Game.NoesisUITest.BP_Testbutton {
        class BP_Testbutton_C extends UE.NoesisInstance {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): BP_Testbutton_C;
            static Load(InName: string): BP_Testbutton_C;
        
            __tid_BP_Testbutton_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 7999B0334D935006BF74F0993E2F9BB6
    namespace Game.NoesisUITest.Cube {
        class Cube_C extends UE.Actor {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            Box: UE.BoxComponent;
            Cube1: UE.StaticMeshComponent;
            DefaultSceneRoot: UE.SceneComponent;
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): Cube_C;
            static Load(InName: string): Cube_C;
        
            __tid_Cube_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 6F2E559248601B5EDDED7C9756D33E87
    namespace Game.NoesisUITest.NewNoesisBlueprint {
        class NewNoesisBlueprint_C extends UE.NoesisInstance {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): NewNoesisBlueprint_C;
            static Load(InName: string): NewNoesisBlueprint_C;
        
            __tid_NewNoesisBlueprint_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 3529C04A4152F7D59691A9898568B22D
    namespace Game.NoesisUITest.NewNoesisBlueprint1 {
        class NewNoesisBlueprint1_C extends UE.NoesisInstance {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): NewNoesisBlueprint1_C;
            static Load(InName: string): NewNoesisBlueprint1_C;
        
            __tid_NewNoesisBlueprint1_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 51A727F546AAF59D9FADA0B3BB7CA75A
    namespace Game.NoesisUITest.NewTestBlueprint {
        class NewTestBlueprint_C extends UE.Blueprint {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): NewTestBlueprint_C;
            static Load(InName: string): NewTestBlueprint_C;
        
            __tid_NewTestBlueprint_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: C1CD57F14A051CB7777C3AA8C42D1702
    namespace Game.NoesisUITest.NewWidgetBlueprint {
        class NewWidgetBlueprint_C extends UE.UserWidget {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            UberGraphFrame: UE.PointerToUberGraphFrame;
            NewVar: boolean;
            NewEventDispatcher: $MulticastDelegate<() => void>;
            ExecuteUbergraph_NewWidgetBlueprint(EntryPoint: number) : void;
            NewEventDispatcher__DelegateSignature() : void;
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): NewWidgetBlueprint_C;
            static Load(InName: string): NewWidgetBlueprint_C;
        
            __tid_NewWidgetBlueprint_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 603CC69949C47B5F0D4272B52F58A9BD
    namespace Game.NoesisUITest.PyActorTest {
        class PyActorTest_C extends UE.PyActor {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            Cube: UE.StaticMeshComponent;
            DefaultSceneRoot: UE.SceneComponent;
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): PyActorTest_C;
            static Load(InName: string): PyActorTest_C;
        
            __tid_PyActorTest_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 76EAC1B94FE9628717F5B88D3CC03F95
    namespace Game.NoesisUITest.PyHudTest {
        class PyHudTest_C extends UE.PyHUD {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            DefaultSceneRoot: UE.SceneComponent;
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): PyHudTest_C;
            static Load(InName: string): PyHudTest_C;
        
            __tid_PyHudTest_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 0AE1B8F340A3CE7B4A6CE09125E1B3DC
    namespace Game.NoesisUITest.PythonTest {
        class PythonTest_C extends UE.PythonComponent {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): PythonTest_C;
            static Load(InName: string): PythonTest_C;
        
            __tid_PythonTest_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 98D9BF9D48ADF2D718E6AF850C6809FD
    namespace Game.NoesisUITest.View {
        class View_C extends UE.NoesisInstance {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): View_C;
            static Load(InName: string): View_C;
        
            __tid_View_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 862A26E84A42F13FB193AC87521ABCE8
    namespace Game.StarterContent.Blueprints.Blueprint_Effect_Explosion {
        class Blueprint_Effect_Explosion_C extends UE.Actor {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            ["Explosion Audio"]: UE.AudioComponent;
            P_Explosion: UE.ParticleSystemComponent;
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): Blueprint_Effect_Explosion_C;
            static Load(InName: string): Blueprint_Effect_Explosion_C;
        
            __tid_Blueprint_Effect_Explosion_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
// __TYPE_DECL_START: 34B105414117D7F5DF9F1B9534DCA89C
    namespace Game.StarterContent.Blueprints.BP_LightStudio {
        class BP_LightStudio_C extends UE.Actor {
            constructor(Outer?: Object, Name?: string, ObjectFlags?: number);
            SkyLight1: UE.SkyLightComponent;
            ExponentialHeightFog1: UE.ExponentialHeightFogComponent;
            PrevisArrow: UE.StaticMeshComponent;
            Skybox: UE.StaticMeshComponent;
            Scene1: UE.SceneComponent;
            GlobalBrightness: number;
            Use_HDRI: boolean;
            UseSunLight: boolean;
            SunBrightness: number;
            SunTint: UE.LinearColor;
            StationaryLightForSun: boolean;
            SunDirectionalLight: UE.DirectionalLightComponent;
            UseAtmosphere: boolean;
            AtmosphereBrightness: number;
            AtmosphereTint: UE.LinearColor;
            PrevisArrowMaterial: UE.MaterialInstanceDynamic;
            LightColor: UE.LinearColor;
            SunColorCurve: UE.CurveLinearColor;
            OverrideSunColor: boolean;
            AtmosphereDensityMultiplier: number;
            AtmosphereAltitude: number;
            DisableSunDisk: boolean;
            UseFog: boolean;
            FogBrightness: number;
            FogTint: UE.LinearColor;
            FogAltitude: number;
            FogMaxOpacity: number;
            FogHeightFalloff: number;
            FogDensity: number;
            FogBrightnessCurve: UE.CurveFloat;
            FogStartDistance: number;
            DisableGroundScattering: boolean;
            AtmosphereDistanceScale: number;
            SkyboxMaterial: UE.MaterialInstanceDynamic;
            HDRI_Brightness: number;
            HDRI_Contrast: number;
            HDRI_Tint: UE.LinearColor;
            HDRI_Cubemap: UE.Texture;
            HDRI_Rotation: number;
            AtmosphereOpacityHorizon: number;
            AtmosphereOpacityZenith: number;
            HighDensityAtmosphere: boolean;
            AtmosphericFog: UE.AtmosphericFogComponent;
            UseSkylight: boolean;
            Shadowdistance: number;
            LightShaftBloom: boolean;
            LightShaftOcclusion: boolean;
            OcclusionMaskDarkness: number;
            BloomScale: number;
            BloomThreshold: number;
            BloomTint: UE.Color;
            AtmosphereFogMultiplier: number;
            AtmosphereDensityHeight: number;
            AtmosphereMaxScatteringOrder: number;
            AtmosphereAltitudeSampleNumber: number;
            LightFunctionMaterial: UE.MaterialInterface;
            MIC_Black: UE.MaterialInstance;
            MIC_HDRI: UE.MaterialInstance;
            AtmosphereDensity() : void;
            CalculateSunColor() : void;
            NormalizedSunAngle(Angle: $Ref<number>) : void;
            SunMobility() : void;
            /*
             *Construction script, the place to spawn components and do other setup.
             *@note Name used in CreateBlueprint function
             */
            UserConstructionScript() : void;
            static StaticClass(): Class;
            static Find(OrigInName: string, Outer?: Object): BP_LightStudio_C;
            static Load(InName: string): BP_LightStudio_C;
        
            __tid_BP_LightStudio_C_0__: boolean;
        }
        
    }

// __TYPE_DECL_END
}
