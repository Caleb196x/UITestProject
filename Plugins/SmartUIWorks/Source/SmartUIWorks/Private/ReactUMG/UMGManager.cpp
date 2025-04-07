/*
 * Tencent is pleased to support the open source community by making Puerts available.
 * Copyright (C) 2020 THL A29 Limited, a Tencent company.  All rights reserved.
 * Puerts is licensed under the BSD 3-Clause License, except for the third-party components listed in the file 'LICENSE' which may
 * be subject to their corresponding license terms. This file is subject to the terms and conditions defined in file 'LICENSE',
 * which is part of this source code package.
 */

#include "ReactUMG/UMGManager.h"
#include "LogSmartUI.h"
#include "Engine/Engine.h"
#include "Async/Async.h"
#include "Kismet/KismetRenderingLibrary.h"

UReactWidget* UUMGManager::CreateReactWidget(UWorld* World)
{
    return ::CreateWidget<UReactWidget>(World);
}

UUserWidget* UUMGManager::CreateWidget(UWorld* World, UClass* Class)
{
    return ::CreateWidget<UUserWidget>(World, Class);
}

void UUMGManager::SynchronizeWidgetProperties(UWidget* Widget)
{
    Widget->SynchronizeProperties();
}

void UUMGManager::SynchronizeSlotProperties(UPanelSlot* Slot)
{
    Slot->SynchronizeProperties();
}


USpineAtlasAsset* UUMGManager::LoadSpineAtlas(UObject* Context, const FString& AtlasPath)
{
    FString RawData;
    if (!FFileHelper::LoadFileToString(RawData, *AtlasPath))
    {
        UE_LOG(LogSmartUI, Error, TEXT("Spine atlas asset file( %s ) not exists."), *AtlasPath);
        return nullptr;
    }
    
    USpineAtlasAsset* SpineAtlasAsset = NewObject<USpineAtlasAsset>(Context, USpineAtlasAsset::StaticClass(),
        NAME_None, RF_Public|RF_Transient);
    SpineAtlasAsset->SetRawData(RawData);
    SpineAtlasAsset->SetAtlasFileName(FName(*AtlasPath));

    FString BaseFilePath = FPaths::GetPath(AtlasPath);

    // load textures
    spine::Atlas* Atlas = SpineAtlasAsset->GetAtlas();
    SpineAtlasAsset->atlasPages.Empty();

    spine::Vector<spine::AtlasPage*> &Pages = Atlas->getPages();
    for (size_t i = 0; i < Pages.size(); ++i)
    {
        spine::AtlasPage *P = Pages[i];
        const FString SourceTextureFilename = FPaths::Combine(*BaseFilePath, UTF8_TO_TCHAR(P->name.buffer()));
        UTexture2D *texture = UKismetRenderingLibrary::ImportFileAsTexture2D(SpineAtlasAsset, SourceTextureFilename);
        SpineAtlasAsset->atlasPages.Add(texture); 
    }
    
    return SpineAtlasAsset;
}

USpineSkeletonDataAsset* UUMGManager::LoadSpineSkeleton(UObject* Context, const FString& SkeletonPath)
{
    TArray<uint8> RawData;
    if (!FFileHelper::LoadFileToArray(RawData, *SkeletonPath, 0))
    {
        UE_LOG(LogSmartUI, Error, TEXT("Spine skeleton asset file( %s ) not exists."), *SkeletonPath);
        return nullptr;
    }

    USpineSkeletonDataAsset* SkeletonDataAsset = NewObject<USpineSkeletonDataAsset>(Context,
            USpineSkeletonDataAsset::StaticClass(), NAME_None, RF_Transient);
    
    SkeletonDataAsset->SetSkeletonDataFileName(FName(*SkeletonPath));
    SkeletonDataAsset->SetRawData(RawData);

    return SkeletonDataAsset;
}

