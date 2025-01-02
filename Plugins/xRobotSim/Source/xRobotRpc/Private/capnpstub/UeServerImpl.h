#pragma once

#include <capnp/rpc-twoparty.h>
#include <kj/async-io.h>

#include "..\CoreRpcUtils.h"
#include "MyObject.h"
#include "ObjectHolder.h"
#include "RpcException.h"
#include "ue.capnp.h"

class ObjectImpl final : public Unreal::Object::Server
{
public:
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

	virtual kj::Promise<void> load(LoadContext context) override
	{
		return kj::READY_NOW;
	}
};

class ClassImpl final : public Unreal::Class::Server
{
public:

	virtual kj::Promise<void> staticClass(StaticClassContext context) override;

	virtual kj::Promise<void> find(FindContext context) override;

	virtual kj::Promise<void> load(LoadContext context) override;
};

class MyObjectImpl final : public Unreal::MyObject::Server
{
public:

	virtual kj::Promise<void> sub(SubContext context) override;

	virtual kj::Promise<void> add(AddContext context) override;

	virtual kj::Promise<void> mul(MulContext context) override;

	virtual kj::Promise<void> div(DivContext context) override
	{
		int32 p0 = context.getParams().getP0();
		int32 p1 = context.getParams().getP1();

		// 从对象列表中获取Uobject对象，并调用对象的函数
		UObject* CorrObject = FObjectHolder::Get().GetUObject(this);
		void* a = static_cast<void*>(&p0);
		void* b = static_cast<void*>(&p1);
		
		
		return kj::READY_NOW;
	}

	virtual kj::Promise<void> staticClass(StaticClassContext context) override
	{
		auto r0 = context.getResults();
		r0.setClass(kj::heap<ClassImpl>());
		return kj::READY_NOW;
	}

	virtual kj::Promise<void> find(FindContext context) override
	{
		auto p0 = context.getParams().getOuter();
		auto p1 = context.getParams().getOriginInName();
		
		return kj::READY_NOW;
	}

	// static函数生成capnp文件时，自动添加后缀8a87dbfe30d69b66Static，用于在客户端代码侧标识静态函数
	virtual kj::Promise<void> printf8a87dbfe30d69b66Static(Printf8a87dbfe30d69b66StaticContext context) override
	{
		return kj::READY_NOW;
	}

	~MyObjectImpl()
	{
		FObjectHolder::Get().RemoveFromRetainer(this);
	}
};


class UnrealServerImpl final : public Unreal::Server
{
public:
	virtual kj::Promise<void> newUEObject(NewUEObjectContext context) override
	{
		
		return kj::READY_NOW;
	}

	virtual kj::Promise<void> createClass(CreateClassContext context) override
	{
		context.getResults().setObject(kj::heap<ClassImpl>());
		// 创建对应的uobject对象，并且记录在一个对象列表中
		return kj::READY_NOW;
	}

	virtual kj::Promise<void> createMyObject(CreateMyObjectContext context) override
	{
		try
		{
			auto KJ_P = kj::heap<MyObjectImpl>(); // 不同类型有不同的写法，capnp继承实现的类
			auto P = static_cast<void*>(KJ_P.get());

			// 创建当前类型对应的类型信息缓存
			// 如果存在则直接返回，然后使用接口完成UObject对象的创建
			// ? UClass从哪里获取，从类型名中获取到，或者直接调用FindClass查找UClass

			// auto TypeContainer = LoadUEType("MyObject");
			// UObject* Obj = TypeContainer.New(Name, ObjectFlags);
			UObject* Obj = nullptr;
			FObjectHolder::Get().RegisterToRetainer(P, Obj);
			context.getResults().setObject(kj::mv(KJ_P));
			
			return kj::READY_NOW;
			
		} catch (const FRuntimeRpcException& e)
		{
			return kj::Promise<void>(kj::Exception(kj::Exception::Type::FAILED,
				e.file(), e.line(), kj::str(e.what())));
		}

	}

	virtual kj::Promise<void> createObject(CreateObjectContext context) override
	{
		context.getResults().setObject(kj::heap<ObjectImpl>());
		return kj::READY_NOW;
	}
};
