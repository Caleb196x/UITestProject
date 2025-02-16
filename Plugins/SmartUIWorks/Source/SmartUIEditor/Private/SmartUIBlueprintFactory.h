#pragma once

UCLASS(BlueprintType)
class USmartUIBlueprintFactory : public UFactory
{
	GENERATED_UCLASS_BODY()
public:
	UPROPERTY(EditAnywhere, Category = NoesisBlueprintFactory, meta = (AllowAbstract = ""))
	TSubclassOf<class USmartUICoreWidget> ParentClass;
	
	virtual UObject* FactoryCreateNew(UClass* Class, UObject* Parent, FName Name, EObjectFlags Flags, UObject* Context, FFeedbackContext* Warn) override;
};
