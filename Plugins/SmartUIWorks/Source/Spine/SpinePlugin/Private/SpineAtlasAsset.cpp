/******************************************************************************
 * Spine Runtimes License Agreement
 * Last updated July 28, 2023. Replaces all prior versions.
 *
 * Copyright (c) 2013-2023, Esoteric Software LLC
 *
 * Integration of the Spine Runtimes into software or otherwise creating
 * derivative works of the Spine Runtimes is permitted under the terms and
 * conditions of Section 2 of the Spine Editor License Agreement:
 * http://esotericsoftware.com/spine-editor-license
 *
 * Otherwise, it is permitted to integrate the Spine Runtimes into software or
 * otherwise create derivative works of the Spine Runtimes (collectively,
 * "Products"), provided that each user of the Products must obtain their own
 * Spine Editor license and redistribution of the Products in any form must
 * include this license and copyright notice.
 *
 * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
 * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THE
 * SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/

#include "SpineAtlasAsset.h"
#include "spine/spine.h"
#include <string.h>
#include <string>

#include "EditorFramework/AssetImportData.h"

#define LOCTEXT_NAMESPACE "Spine"

using namespace spine;

#if WITH_EDITORONLY_DATA

void USpineAtlasAsset::SetAtlasFileName(const FName &AtlasFileName) {
	importData->UpdateFilenameOnly(AtlasFileName.ToString());
	TArray<FString> files;
	importData->ExtractFilenames(files);
	if (files.Num() > 0)
		atlasFileName = FName(*files[0]);
}

void USpineAtlasAsset::PostInitProperties() {
	if (!HasAnyFlags(RF_ClassDefaultObject))
		importData = NewObject<UAssetImportData>(this, TEXT("AssetImportData"));
	Super::PostInitProperties();
}

void USpineAtlasAsset::Serialize(FArchive &Ar) {
	Super::Serialize(Ar);
#if ENGINE_MAJOR_VERSION == 4 && ENGINE_MINOR_VERSION <= 27
	if (Ar.IsLoading() && Ar.UE4Ver() < VER_UE4_ASSET_IMPORT_DATA_AS_JSON && !importData)
#else
	if (Ar.IsLoading() && Ar.UEVer() < VER_UE4_ASSET_IMPORT_DATA_AS_JSON && !importData)
#endif
		importData = NewObject<UAssetImportData>(this, TEXT("AssetImportData"));
}

#endif

FName USpineAtlasAsset::GetAtlasFileName() const {
#if WITH_EDITORONLY_DATA
	TArray<FString> files;
	if (importData)
		importData->ExtractFilenames(files);
	if (files.Num() > 0)
		return FName(*files[0]);
	else
		return atlasFileName;
#else
	return atlasFileName;
#endif
}

void USpineAtlasAsset::SetRawData(const FString &RawData) {
	this->rawData = RawData;
	if (atlas) {
		delete atlas;
		atlas = nullptr;
	}
}

void USpineAtlasAsset::BeginDestroy() {
	if (atlas) {
		delete atlas;
		atlas = nullptr;
	}
	Super::BeginDestroy();
}

class UETextureLoader : public TextureLoader {
	void load(AtlasPage &page, const String &path) {
		page.texture = (void *) (uintptr_t) page.index;
	}

	void unload(void *texture) {
	}
};

UETextureLoader _spineUETextureLoader;

Atlas *USpineAtlasAsset::GetAtlas() {
	if (!atlas) {
		if (atlas) {
			delete atlas;
			atlas = nullptr;
		}
		std::string t = TCHAR_TO_UTF8(*rawData);

		atlas = new (__FILE__, __LINE__)
				Atlas(t.c_str(), strlen(t.c_str()), "", &_spineUETextureLoader);
	}
	return this->atlas;
}

#undef LOCTEXT_NAMESPACE
