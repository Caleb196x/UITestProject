#include "UnrealCoreServerImpl.h"

#include "CoreRpcUtils.h"
#include "ObjectHolder.h"

kj::Promise<void> FUnrealCoreServerImpl::newObject(NewObjectContext context)
{
	auto AllocClass = context.getParams().getClass();
	auto Outer = context.getParams().getOuter();
	auto NewObjName = context.getParams().getObjName();
	auto Flags = context.getParams().getFlags();
	
	auto ResponseObj = context.getResults().initObject();
	
	FString StrClassName = UTF8_TO_TCHAR(AllocClass.getTypeName().cStr());
	void* ClientHolder = reinterpret_cast<void*>(Outer.getAddress());

	// TODO: check address
	
	UObject* Obj = FObjectHolder::Get().GetUObject(ClientHolder);

	// TODO: handle create object failure
	if (!Obj)
	{
		FStructTypeContainer* TypeContainer = FCoreUtils::LoadUEType(StrClassName);
		Obj = TypeContainer->New(StrClassName, Flags);
		FObjectHolder::Get().RegisterToRetainer(ClientHolder, Obj);
	}

	ResponseObj.setName(NewObjName.cStr());
	ResponseObj.setAddress(reinterpret_cast<uint64_t>(Obj));
	
	return kj::READY_NOW;
}

kj::Promise<void> FUnrealCoreServerImpl::destroyObject(DestroyObjectContext context)
{
	auto Outer = context.getParams().getOuter();
	auto PointerAddr = Outer.getAddress();
	void* ClientHolder = reinterpret_cast<void*>(PointerAddr);

	// TODO: check address

	if (!FObjectHolder::Get().HasObject(ClientHolder))
	{
		context.getResults().setResult(false);
	}
	else
	{
		FObjectHolder::Get().RemoveFromRetainer(ClientHolder);
		context.getResults().setResult(true);
	}
	
	return kj::READY_NOW;
}

kj::Promise<void> FUnrealCoreServerImpl::callFunction(CallFunctionContext context)
{
	auto Outer = context.getParams().getOuter();
	auto CallObject = context.getParams().getCallObject();
	auto FuncName = context.getParams().getFuncName().cStr();
	auto Class = context.getParams().getClass();
	auto FuncParams = context.getParams().getParams();

	void* ClientHolder = reinterpret_cast<void*>(Outer.getAddress());
	if (!FObjectHolder::Get().HasObject(ClientHolder))
	{
		// throw exception to client
		return kj::Promise<void>(kj::Exception(kj::Exception::Type::FAILED,
				__FILE__, __LINE__, kj::str("Can not find the object in system's object holder, run newObject at first.")));
	}

	UObject* FoundObject = FObjectHolder::Get().GetUObject(ClientHolder);
	UObject* PassedInObject = reinterpret_cast<UObject*>(CallObject.getAddress());

	if (FoundObject != PassedInObject)
	{
		char buff[128];
		sprintf_s(buff, sizeof(buff),
			"Call function %s failed, the object found in object holder %p is not equal to passed by caller %p",
			FuncName, FoundObject, PassedInObject);
		
		return kj::Promise<void>(kj::Exception(kj::Exception::Type::FAILED,
				__FILE__, __LINE__, kj::str(buff)));
	}

	FString ClassName = UTF8_TO_TCHAR(Class.getTypeName().cStr());
	auto* TypeContainer = FCoreUtils::GetUEType(ClassName);
	if (!TypeContainer)
	{
		return kj::Promise<void>(kj::Exception(kj::Exception::Type::FAILED,
		__FILE__, __LINE__, kj::str("Can not find class type")));
	}

	auto FuncWrapper = TypeContainer->FindFunction(UTF8_TO_TCHAR(FuncName));
	//
	//  FuncWrapper->Call(FoundObject, );
	
	return kj::READY_NOW;
}

