// Copyright Epic Games, Inc. All Rights Reserved.

#include "XmlUIGameMode.h"
#include "XmlUICharacter.h"
#include "UObject/ConstructorHelpers.h"

AXmlUIGameMode::AXmlUIGameMode()
	: Super()
{
	// set default pawn class to our Blueprinted character
	static ConstructorHelpers::FClassFinder<APawn> PlayerPawnClassFinder(TEXT("/Game/FirstPerson/Blueprints/BP_FirstPersonCharacter"));
	DefaultPawnClass = PlayerPawnClassFinder.Class;

}
