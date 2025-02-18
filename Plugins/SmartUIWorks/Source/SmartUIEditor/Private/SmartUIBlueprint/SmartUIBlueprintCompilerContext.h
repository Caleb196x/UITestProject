#pragma once

#include "KismetCompiler.h"

class FSmartUIBlueprintCompilerContext : public FKismetCompilerContext
{
protected:

	typedef FKismetCompilerContext Super;

public:
	FSmartUIBlueprintCompilerContext(class USmartUIBlueprint* SourceBlueprint, FCompilerResultsLog& InMessageLog, const FKismetCompilerOptions& InCompilerOptions);
	virtual ~FSmartUIBlueprintCompilerContext();

	// FKismetCompilerContext interface
	virtual void SpawnNewClass(const FString& NewClassName) override;
	virtual void EnsureProperGeneratedClass(UClass*& TargetClass) override;
	virtual void CopyTermDefaultsToDefaultObject(UObject* DefaultObject) override;
	// End of FKismetCompilerContext interface
};
