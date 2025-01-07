#pragma once
#include "capnpstub/ue_core.capnp.h"
#include "kj/async-io.h"

#include <string>

class FUnrealCoreServerImpl final : public UnrealCore::Server
{
public:
	
	virtual ~FUnrealCoreServerImpl() {}

protected:
	virtual kj::Promise<void> newObject(NewObjectContext context) override;

	virtual kj::Promise<void> destroyObject(DestroyObjectContext context) override;
	
	virtual kj::Promise<void> callFunction(CallFunctionContext context) override;

	virtual kj::Promise<void> callStaticFunction(CallStaticFunctionContext context) override;

	virtual kj::Promise<void> findClass(FindClassContext context) override;

	virtual kj::Promise<void> loadClass(LoadClassContext context) override;

	virtual kj::Promise<void> staticClass(StaticClassContext context) override;

	virtual kj::Promise<void> bindDelegate(BindDelegateContext context) override;

	virtual kj::Promise<void> unbindDelegate(UnbindDelegateContext context) override;

	virtual kj::Promise<void> addMultiDelegate(AddMultiDelegateContext context) override;

	virtual kj::Promise<void> removeMultiDelegate(RemoveMultiDelegateContext context) override;

	virtual kj::Promise<void> registerOverrideClass(RegisterOverrideClassContext context) override;

	virtual kj::Promise<void> unregisterOverrideClass(UnregisterOverrideClassContext context) override;

	virtual kj::Promise<void> setProperty(SetPropertyContext context) override;

	virtual kj::Promise<void> getProperty(GetPropertyContext context) override;
	
};
