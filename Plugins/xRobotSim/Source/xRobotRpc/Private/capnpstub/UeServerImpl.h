#pragma once

#include "MyObject.h"
#include "ue.capnp.h"

class UEServerImpl final : public Unreal::Server
{
public:
	
};

class ObjectImpl final : public Unreal::Object::Server
{
public:
	virtual kj::Promise<void> constructor(ConstructorContext context) override;

	virtual kj::Promise<void> createDefaultSubobject(CreateDefaultSubobjectContext context) override;

	virtual kj::Promise<void> executeUbergraph(ExecuteUbergraphContext context) override;

	virtual kj::Promise<void> getClass(GetClassContext context) override;

	virtual kj::Promise<void> getName(GetNameContext context) override;

	virtual kj::Promise<void> getOuter(GetOuterContext context) override;

	virtual kj::Promise<void> hasAnyFlags(HasAnyFlagsContext context) override;

	virtual kj::Promise<void> hasAllFlags(HasAllFlagsContext context) override;

	virtual kj::Promise<void> hasClassFlag(HasClassFlagContext context) override;

	virtual kj::Promise<void> hasClassFlagEx(HasClassFlagExContext context) override;

	virtual kj::Promise<void> isA(IsAContext context) override;

	virtual kj::Promise<void> isChildOf(IsChildOfContext context) override;

	virtual kj::Promise<void> isNative(IsNativeContext context) override;

	virtual kj::Promise<void> staticClass(StaticClassContext context) override;

	virtual kj::Promise<void> find(FindContext context) override;

	virtual kj::Promise<void> load(LoadContext context) override;
};

class ClassImpl final : public Unreal::Class::Server
{
public:
	virtual kj::Promise<void> constructor(ConstructorContext context) override;

	virtual kj::Promise<void> staticClass(StaticClassContext context) override;

	virtual kj::Promise<void> find(FindContext context) override;

	virtual kj::Promise<void> load(LoadContext context) override;
};

class MyObjectImpl final : public Unreal::MyObject::Server
{
public:
	virtual kj::Promise<void> constructor(ConstructorContext context) override;

	virtual kj::Promise<void> sub(SubContext context) override;

	virtual kj::Promise<void> add(AddContext context) override;

	virtual kj::Promise<void> mul(MulContext context) override;

	virtual kj::Promise<void> div(DivContext context) override
	{
		auto p0 = context.getParams().getP0();
		auto p1 = context.getParams().getP1();
		UE_LOG(LogTemp, Display, TEXT("Rpc: %d / %d = %d"), p0, p1, p0 / p1);

		
		return kj::READY_NOW;
	}

};
