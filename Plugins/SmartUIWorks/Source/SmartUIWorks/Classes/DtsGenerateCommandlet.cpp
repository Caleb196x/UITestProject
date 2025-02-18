#include "DtsGenerateCommandlet.h"
#include "ReactUMG/ReactDeclarationGenerator.h"

UDtsGenerateCommandlet::UDtsGenerateCommandlet()
{
	
}

int32 UDtsGenerateCommandlet::Main(const FString& Params)
{
	// 1. 生成puerts ue.d.ts and ue_bp_d.ts

	
	// 2. 生成react-umg/component.js
	UReactDeclarationGenerator* ReactComponentGenerator = NewObject<UReactDeclarationGenerator>();
	ReactComponentGenerator->Gen();
	
	return 0;
}

