#pragma once
#include "Commandlets/Commandlet.h"
#include "DtsGenerateCommandlet.generated.h"

UCLASS()
class SMARTUIWORKS_API UDtsGenerateCommandlet : public UCommandlet
{
	GENERATED_BODY()
public:
	UDtsGenerateCommandlet();
	
	virtual int32 Main(const FString& Params) override;
};
