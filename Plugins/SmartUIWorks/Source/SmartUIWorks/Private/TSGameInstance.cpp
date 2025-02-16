// Fill out your copyright notice in the Description page of Project Settings.
#include "TSGameInstance.h"

void UTsGameInstance::Init()
{
	Super::Init();
}

void UTsGameInstance::OnStart()
{
	Super::OnStart();
	//GameScript = MakeShared<puerts::FJsEnv>();
	GameScript = MakeShared<puerts::FJsEnv>(std::make_unique<puerts::DefaultJSModuleLoader>(TEXT("JavaScript")), std::make_shared<puerts::FDefaultLogger>(), 8080);
	//GameScript->WaitDebugger();
	TArray<TPair<FString, UObject*>> Arguments;
	Arguments.Add(TPair<FString, UObject*>(TEXT("GameInstance"), this));
	GameScript->Start("Main/UsingReactUMG", Arguments);
	
	GameScript2 = MakeShared<puerts::FJsEnv>(std::make_unique<puerts::DefaultJSModuleLoader>(TEXT("JavaScript")), std::make_shared<puerts::FDefaultLogger>(), 7080);

	GameScript2->Start("Main/UsingReactUMG2", Arguments);
}

void UTsGameInstance::Shutdown()
{
	Super::Shutdown();
	GameScript.Reset();
	GameScript2.Reset();
}