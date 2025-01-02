#pragma once

#include "capnpstub/ue_core.capnp.h"

class FUnrealCoreServerImpl : public UnrealCore::Server
{
public:
	virtual kj::Promise<void> newObject(NewObjectContext context) override;

	virtual kj::Promise<void> destroyObject(DestroyObjectContext context) override;
	
	virtual kj::Promise<void> callFunction(CallFunctionContext context) override;

	virtual kj::Promise<void> callStaticFunction(CallStaticFunctionContext context) override
	{
		return kj::READY_NOW;
	}

	virtual kj::Promise<void> findClass(FindClassContext context) override
	{
		return kj::READY_NOW;
	}

	virtual kj::Promise<void> loadClass(LoadClassContext context) override
	{
		return kj::READY_NOW;
	}

	virtual kj::Promise<void> staticClass(StaticClassContext context) override
	{
		return kj::READY_NOW;
	}

	virtual kj::Promise<void> bindDelegate(BindDelegateContext context) override
	{
		return kj::READY_NOW;
	}

	virtual kj::Promise<void> unbindDelegate(UnbindDelegateContext context) override
	{
		return kj::READY_NOW;
	}

	virtual kj::Promise<void> addMultiDelegate(AddMultiDelegateContext context) override
	{
		return kj::READY_NOW;
	}

	virtual kj::Promise<void> removeMultiDelegate(RemoveMultiDelegateContext context) override
	{
		return kj::READY_NOW;
	}

	virtual kj::Promise<void> registerOverrideClass(RegisterOverrideClassContext context) override
	{
		return kj::READY_NOW;
	}

	virtual kj::Promise<void> unregisterOverrideClass(UnregisterOverrideClassContext context) override
	{
		return kj::READY_NOW;
	}

	virtual ~FUnrealCoreServerImpl() {}
};
