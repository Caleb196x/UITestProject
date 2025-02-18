#include "SmartUICoreWidget.h"

#include "JsBridgeCaller.h"
#include "JsEnvRuntime.h"
#include "LogSmartUI.h"
#include "SmartUIBlueprint.h"
#include "ReactUMG/ReactWidget.h"
#include "Blueprint/WidgetTree.h"

USmartUICoreWidget::USmartUICoreWidget(const FObjectInitializer& ObjectInitializer)
	: Super(ObjectInitializer)
{
	TRACE_CPUPROFILER_EVENT_SCOPE(USmartUICoreWidgetInit)
	uint64 StartCycles = FPlatformTime::Cycles64();

	WidgetTree = CreateDefaultSubobject<UWidgetTree>(TEXT("WidgetTree"));
	WidgetTree->SetFlags(RF_Transactional);
	WidgetName = TEXT("smart_ui"); // todo: set by blueprint
	
	init();
	
	uint64 EndCycles = FPlatformTime::Cycles64();
    
	double ElapsedMs = FPlatformTime::ToMilliseconds64(EndCycles - StartCycles);
    
	UE_LOG(LogTemp, Log, TEXT("Execution Time: %.6f ms"), ElapsedMs);
}

void USmartUICoreWidget::BeginDestroy()
{
	Super::BeginDestroy();
	ReleaseJsEnv(); // Releasing the environment as a fallback has already been done in the launch script
	UE_LOG(LogSmartUI, Display, TEXT("Release javascript environment when BeginDestroy of Object"))
}

void USmartUICoreWidget::init()
{
	if (!UJsBridgeCaller::IsExistBridgeCaller(WidgetName))
	{
		TArray<TPair<FString, UObject*>> Arguments;
		UJsBridgeCaller* Caller = UJsBridgeCaller::AddNewBridgeCaller(WidgetName);
		Arguments.Add(TPair<FString, UObject*>(TEXT("BridgeCaller"), Caller));
		Arguments.Add(TPair<FString, UObject*>(TEXT("CoreWidget"), this));
		
		MainReactJsScriptPath = FString::Printf(TEXT("Main/%s/launch"), *WidgetName);

		JsEnv = FJsEnvRuntime::GetInstance().GetFreeJsEnv();
		if (JsEnv)
		{
		
			const bool Result = FJsEnvRuntime::GetInstance().StartJavaScript(JsEnv, MainReactJsScriptPath, Arguments);
			if (!Result)
			{
				UJsBridgeCaller::RemoveBridgeCaller(WidgetName);
				UE_LOG(LogSmartUI, Warning, TEXT("Start ui javascript file %s failed"), *MainReactJsScriptPath);
			}
		}
		else
		{
			UJsBridgeCaller::RemoveBridgeCaller(WidgetName);
			UE_LOG(LogSmartUI, Error, TEXT("Can not obtain any valid javascript runtime environment"))
			return;
		}
	}
	
	const bool DelegateRunResult = UJsBridgeCaller::ExecuteMainCaller(WidgetName, this);
	if (!DelegateRunResult)
	{
		UJsBridgeCaller::RemoveBridgeCaller(WidgetName);
		UE_LOG(LogSmartUI, Warning, TEXT("Not bind any bridge caller for %s"), *WidgetName);
	}
}

UPanelSlot* USmartUICoreWidget::AddChild(UWidget* Content)
{
	if (Content == nullptr)
	{
		return nullptr;
	}

	if (RootSlot)
	{
		return nullptr;
	}

	Content->RemoveFromParent();

	EObjectFlags NewObjectFlags = RF_Transactional;
	if (HasAnyFlags(RF_Transient))
	{
		NewObjectFlags |= RF_Transient;
	}

	UPanelSlot* PanelSlot = NewObject<UPanelSlot>(this, UPanelSlot::StaticClass(), FName("PanelSlot_USmartUICoreWidget"), NewObjectFlags);
	PanelSlot->Content = Content;

	Content->Slot = PanelSlot;

	RootSlot = PanelSlot;

	WidgetTree->RootWidget = Content;

	InvalidateLayoutAndVolatility();

	return PanelSlot;
}

bool USmartUICoreWidget::RemoveChild(UWidget* Content)
{
	if (Content == nullptr || RootSlot == nullptr || Content != RootSlot->Content)
	{
		return false;
	}
	UPanelSlot* PanelSlot = RootSlot;
	RootSlot = nullptr;

	if (PanelSlot->Content)
	{
		PanelSlot->Content->Slot = nullptr;
	}

	const bool bReleaseChildren = true;
	PanelSlot->ReleaseSlateResources(bReleaseChildren);
	PanelSlot->Parent = nullptr;
	PanelSlot->Content = nullptr;

	WidgetTree->RootWidget = nullptr;

	InvalidateLayoutAndVolatility();

	return true;
}

void USmartUICoreWidget::ReleaseJsEnv()
{
	if (JsEnv)
	{
		UE_LOG(LogSmartUI, Display, TEXT("Release javascript env in order to excuting other script"))
		FJsEnvRuntime::GetInstance().ReleaseJsEnv(JsEnv);
		JsEnv = nullptr;
	}
}

FString USmartUICoreWidget::GetWidgetName()
{
	return WidgetName;
}

