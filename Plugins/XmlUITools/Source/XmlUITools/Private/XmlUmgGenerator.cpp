﻿// Fill out your copyright notice in the Description page of Project Settings.


#include "XmlUmgGenerator.h"

#include "LogXmlUmg.h"
#include "ObjectEditorUtils.h"
#include "StringUtils.h"
#include "Blueprint/WidgetTree.h"
#include "Blueprint/UserWidget.h"
#include "PropertySetter/PropertySetter.h"
#include "PropertySetter/SetterFactory.h"

FWidgetClassTemplate::FWidgetClassTemplate()
	: WidgetClass(nullptr)
{
	
}

FWidgetClassTemplate::FWidgetClassTemplate(TSubclassOf<UWidget> InWidgetClass)
	: WidgetClass(InWidgetClass.Get())
{
	// register for any objects replaced
	FCoreUObjectDelegates::OnObjectsReplaced.AddRaw(this, &FWidgetClassTemplate::OnObjectsReplaced);
}

FWidgetClassTemplate::FWidgetClassTemplate(const FAssetData& InWidgetAssetData, TSubclassOf<UWidget> InWidgetClass)
	: WidgetClass(InWidgetClass.Get()),
	  WidgetAssetData(InWidgetAssetData)
{
	
}

UWidget* FWidgetClassTemplate::Create(UWidgetTree* Tree)
{
	return CreateNamed(Tree, NAME_None);
}

void FWidgetClassTemplate::OnObjectsReplaced(const TMap<UObject*, UObject*>& ReplacementMap)
{
	UObject* const* NewObject = ReplacementMap.Find(WidgetClass.Get());
	if (NewObject)
	{
		WidgetClass = CastChecked<UClass>(*NewObject);
	}
}

UWidget* FWidgetClassTemplate::CreateNamed(class UWidgetTree* Tree, FName NameOverride)
{
	if (Tree == nullptr
		|| !WidgetClass.IsValid()
		|| WidgetClass.Get()->HasAnyClassFlags(CLASS_Abstract | CLASS_Deprecated))
	{
		return nullptr;
	}
	
	// For inherited widget trees, we need to make sure the name is unique for the parent tree
	// We do this even if NameOverride is not set as the default name could exist in the parent tree
	if (Tree->RootWidget == nullptr)
	{
		
	}

	if(NameOverride != NAME_None)
	{
		UObject* ExistingObject = StaticFindObject(UObject::StaticClass(), Tree, *NameOverride.ToString());
		if (ExistingObject != nullptr)
		{
			NameOverride = MakeUniqueObjectName(Tree, WidgetClass.Get(), NameOverride);
		}
	}
	
	return Tree->ConstructWidget<UWidget>(WidgetClass.Get(), NameOverride);
}

UWidgetTree* UXmlUmgGenerator::GenerateWidgetTree(UUserWidget* Outer, UXmlUmgTree* XmlUmgTree)
{
	UWidgetTree* WidgetTree = NewObject<UWidgetTree>(Outer, UWidgetTree::StaticClass());
	UXmlUmgNode* RootNode = XmlUmgTree->Root;

	if (!AllWidgetClasses.Contains(RootNode->WidgetName))
	{
		UE_LOG(LogXmlUmg, Error, TEXT("Not exist widget component %s"), *RootNode->WidgetName)
		// todo: broadcast a error delegate
		return WidgetTree;
	}

	auto CreateWidget = [this, WidgetTree](UXmlUmgNode* Node) -> UWidget*
	{
		if (const TSharedPtr<FWidgetClassTemplate>* WidgetTemplate = AllWidgetClasses.Find(Node->WidgetName))
		{
			TWeakObjectPtr<UClass> WidgetClass = (*WidgetTemplate)->GetWidgetClass();

			UWidget* Widget = (*WidgetTemplate)->Create(WidgetTree);
			
			if (!WidgetClass.IsValid())
			{
				UE_LOG(LogXmlUmg, Warning, TEXT("Widget class of %s is invalid"), *Node->WidgetName)
				return Widget;
			}

			for (TFieldIterator<FProperty> PropertyIt(WidgetClass.Get()); PropertyIt; ++PropertyIt)
            {
                FProperty* Property = *PropertyIt;
				FString PropertyName = WidgetClass->GetAuthoredNameForField(Property);
				if (Node->Properties.Contains(PropertyName))
				{
					FXmlAttribute* Attr = Node->Properties.Find(PropertyName);
					void* Value = Property->ContainerPtrToValuePtr<uint8>(Widget);
					if (XmlUITools::IPropertySetter* Setter = XmlUITools::FSetterFactory::CreateSetter(Property, Attr->Type))
                    {
						FString FailedResult;
                        if (!Setter->SetValue(Widget, PropertyName, Attr, WidgetClass.Get(), Value, &FailedResult))
                        {
	                        UE_LOG(LogXmlUmg, Error, TEXT("Failed to set property %s of widget %s, error: %s"), *PropertyName, *Node->WidgetName, *FailedResult)
                        }

						delete Setter;
                    }
				}
            }
			
			// todo: setup display text
			Widget->SetDisplayLabel(Node->WidgetDisplayText);
			
			return Widget;
		}
		
		return nullptr;
	};

	TQueue<TPair<UXmlUmgNode*, UWidget*> > TraverseQueue;
	if (UWidget* RootWidget = CreateWidget(RootNode))
	{
		WidgetTree->RootWidget = RootWidget;
		TraverseQueue.Enqueue(MakeTuple(RootNode, RootWidget));
	}
	else
	{
		UE_LOG(LogXmlUmg, Error, TEXT("Create Root widget %s failed"), *RootNode->WidgetName)
		// todo: broadcast error delegate
		return WidgetTree;
	}
	
	while (!TraverseQueue.IsEmpty())
	{
		TPair<UXmlUmgNode*, UWidget*> Parent;
		TraverseQueue.Dequeue(Parent);

		UXmlUmgNode* ParentNode = Parent.Key;
		UWidget* ParentWidget = Parent.Value;

		if (UPanelWidget* PanelWidget = Cast<UPanelWidget>(ParentWidget))
		{
			if (!PanelWidget->CanAddMoreChildren() && ParentNode->ChildNodes.Num() > 0)
			{
				UE_LOG(LogXmlUmg, Warning, TEXT("Can not add more children for parent widget %s"), *ParentNode->WidgetName)
				// todo: broadcast error delegate
				continue;
			}

			if (!PanelWidget->CanHaveMultipleChildren() && ParentNode->ChildNodes.Num() > 1)
			{
				UE_LOG(LogXmlUmg, Warning, TEXT("Can not add multiple children nodes for parent widget %s"), *ParentNode->WidgetName)
				// todo: broadcast error delegate
				continue;
			}

			for (UXmlUmgNode* ChildNode : ParentNode->ChildNodes)
			{
				if (UWidget* ChildWidget = CreateWidget(ChildNode))
				{
					PanelWidget->AddChild(ChildWidget);
					TraverseQueue.Enqueue(MakeTuple(ChildNode, ChildWidget));
				}
			}
		}
		else if (ParentNode->ChildNodes.Num() > 0)
		{
			UE_LOG(LogXmlUmg, Display, TEXT("Widget node %s can not add any child widget but it has child nodes in defination."), *ParentNode->WidgetName)
			// todo: broadcast error delegate
		}
	}

	return WidgetTree;
}


void UXmlUmgGenerator::BuildAllWidgetClassList(const UClass* ActiveCurrentClass)
{
	FString ActiveClassName;
	if (ActiveCurrentClass)
	{
		ActiveClassName = ActiveCurrentClass->GetName();
	}

	// traverse all uclasses
	for (TObjectIterator<UClass> ClassIt; ClassIt; ++ClassIt)
	{
		UClass* WidgetClass = *ClassIt;
		if (WidgetClass->GetName() == ActiveClassName)
		{
			continue;
		}
		
		if (WidgetClass->HasAnyClassFlags(CLASS_HideDropDown | CLASS_Hidden))
		{
			continue;
		}
		
		if (!IsUsableWidgetClass(WidgetClass))
		{
			continue;
		}
		
		// Convert name to lowercase letter underline format
		const FString WidgetName = WidgetClass->GetName();
		
		if (WidgetClass->IsChildOf(UUserWidget::StaticClass()))
		{
			AllWidgetClasses.Add(WidgetName, MakeShared<FWidgetClassTemplate>(FAssetData(WidgetClass), WidgetClass));
		}
		else
		{
			AllWidgetClasses.Add(WidgetName, MakeShared<FWidgetClassTemplate>(WidgetClass));
		}
	}

	// todo: traverse all blueprint widget classes
	
}

bool UXmlUmgGenerator::IsUsableWidgetClass(const UClass* WidgetClass)
{
	if (WidgetClass->IsChildOf(UWidget::StaticClass()))
	{
		// We aren't interested in classes that are experimental or cannot be instantiated
		bool bIsExperimental, bIsEarlyAccess;
		FString MostDerivedDevelopmentClassName;
		FObjectEditorUtils::GetClassDevelopmentStatus(const_cast<UClass*>(WidgetClass), bIsExperimental, bIsEarlyAccess, MostDerivedDevelopmentClassName);
		const bool bIsInvalid = WidgetClass->HasAnyClassFlags(CLASS_Abstract | CLASS_Deprecated | CLASS_NewerVersionExists);
		if (bIsExperimental || bIsEarlyAccess || bIsInvalid)
		{
			return false;
		}

		// Don't include skeleton classes or the same class as the widget being edited
		const bool bIsSkeletonClass = WidgetClass->HasAnyFlags(RF_Transient) && WidgetClass->HasAnyClassFlags(CLASS_CompiledFromBlueprint);

		// Check that the asset that generated this class is valid (necessary b/c of a larger issue wherein force delete does not wipe the generated class object)
		if (bIsSkeletonClass)
		{
			return false;
		}
		
		return true;
	}
	return false;
}