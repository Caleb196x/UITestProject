#include "SmartUICoreWidget.h"

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
	
	init();
	
	uint64 EndCycles = FPlatformTime::Cycles64();
    
	double ElapsedMs = FPlatformTime::ToMilliseconds64(EndCycles - StartCycles);
    
	UE_LOG(LogTemp, Log, TEXT("Execution Time: %.6f ms"), ElapsedMs);
}

void USmartUICoreWidget::BeginDestroy()
{
	Super::BeginDestroy();
	ReleaseJsEnv();
}

void USmartUICoreWidget::init()
{
	if (GetName().StartsWith("Default__"))
	{
		return;
	}
	
	// 1. 准备参数
	TArray<TPair<FString, UObject*>> Arguments;
	Arguments.Add(TPair<FString, UObject*>(TEXT("CoreWidget"), this));
	MainReactJsScriptPath = TEXT("Main/UsingReactUMG");
	
	// 2. 执行js入口脚本，js脚本会根据定义填充RootWidget
	JsEnv = MakeShared<puerts::FJsEnv>(
		std::make_unique<puerts::DefaultJSModuleLoader>(TEXT("JavaScript")),
		std::make_shared<puerts::FDefaultLogger>(),8086);
	if (JsEnv)
	{
		JsEnv->Start(MainReactJsScriptPath, Arguments);
		/*
		if (!Result)
		{
			UE_LOG(LogSmartUI, Warning, TEXT("Start ui javascript file %s failed"), *MainReactJsScriptPath);
		}*/
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
		JsEnv.Reset();
		JsEnv = nullptr;
	}
}
