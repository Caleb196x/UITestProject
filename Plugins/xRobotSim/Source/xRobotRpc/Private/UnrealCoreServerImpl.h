#pragma once
#include <functional>
#include <future>

#include "UnrealPythonRpcLog.h"
#include "capnpstub/ue_core.capnp.h"
#include "kj/async-io.h"

struct ErrorInfo
{
	FString Message;
	FString File;
	int32 Line;

	bool bIsSuccess;

	ErrorInfo() : Message(""), File(""), Line(0), bIsSuccess(true) {}
	
	ErrorInfo(bool InIsError) : Message(""), File(""), Line(0), bIsSuccess(InIsError) {}

	ErrorInfo(const char* InFile, const int32 InLine, const FString& InMsg) :
		Message(InMsg), File(UTF8_TO_TCHAR(InFile)), Line(InLine), bIsSuccess(false)
	{}

	ErrorInfo(const ErrorInfo& Info)
		: Message(Info.Message), File(Info.File), Line(Info.Line), bIsSuccess(Info.bIsSuccess) {}

	ErrorInfo(ErrorInfo&& Info) noexcept 
		: Message(Info.Message), File(Info.File), Line(Info.Line), bIsSuccess(Info.bIsSuccess) {}

	const char* MessageCStr() const
	{
		return TCHAR_TO_UTF8(*Message);
	}

	const char* FileCStr() const
	{
		return TCHAR_TO_UTF8(*File);
	}
};

template<typename T>
struct ResultWithException
{
	T Context;
	ErrorInfo Info;

	ResultWithException(const T& Context, const ErrorInfo& Info) : Context(Context), Info(Info) {}
};

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

	virtual kj::Promise<void> registerCreatedPyObject(RegisterCreatedPyObjectContext context) override;

	virtual kj::Promise<void> newContainer(NewContainerContext context) override;

	virtual kj::Promise<void> destroyContainer(DestroyContainerContext context) override;

	/****************************Internal functions*********************************************/

	static ErrorInfo NewObjectInternal(NewObjectContext context);

	static ErrorInfo DestroyObjectInternal(DestroyObjectContext context);

	static ErrorInfo SetPropertyInternal(SetPropertyContext context);

	static ErrorInfo GetPropertyInternal(GetPropertyContext context);

	static ErrorInfo CallFunctionInternal(CallFunctionContext context);

	static ErrorInfo CallStaticFunctionInternal(CallStaticFunctionContext context);
	
	static ErrorInfo FindClassInternal(FindClassContext context);

	static ErrorInfo LoadClassInternal(LoadClassContext context);

	static ErrorInfo StaticClassInternal(StaticClassContext context);

	static ErrorInfo BindDelegateInternal(BindDelegateContext context);

	static ErrorInfo UnbindDelegateInternal(UnbindDelegateContext context);

	static ErrorInfo AddMultiDelegateInternal(AddMultiDelegateContext context);

	static ErrorInfo RemoveMultiDelegateInternal(RemoveMultiDelegateContext context);

	static ErrorInfo RegisterOverrideClassInternal(RegisterOverrideClassContext context);

	static ErrorInfo UnregisterOverrideClassInternal(UnregisterOverrideClassContext context);

	static ErrorInfo RegisterCreatedPyObjectInternal(RegisterCreatedPyObjectContext context);

	static ErrorInfo NewContainerInternal(NewContainerContext context);

	static ErrorInfo DestroyContainerInternal(DestroyContainerContext context);
};

template<typename T>
class GameThreadDispatcher
{
public:
	
	static ResultWithException<T> EnqueueToGameThreadExec(std::function<ErrorInfo(T)>&& Func, T Context)
	{
		std::promise<ResultWithException<T>> Promise;
		auto Future = Promise.get_future();
		UE_LOG(LogUnrealPython, Warning, TEXT("Enqueue lambda function to game thread"));
		// fixme@caleb196x: task graph maybe time consuming (大约会等待300ms，修改成事件队列的形式，每个tick取出函数调用，在game thread下执行) 
		AsyncTask(ENamedThreads::GameThread, [&Promise, Context, Func = std::move(Func)]()
		{
			UE_LOG(LogUnrealPython, Warning, TEXT("Step into lambda function"));
			ErrorInfo Info = Func(Context);
			ResultWithException<T> Result(Context, Info);
			
			Promise.set_value(std::move(Result));
			UE_LOG(LogUnrealPython, Warning, TEXT("Running in lambda function"));
		});
		ResultWithException<T> Result = Future.get();

		UE_LOG(LogUnrealPython, Warning, TEXT("GameThreadDispatcher::EnqueueToGameThreadExec finished "));
		return Result;
	}

};