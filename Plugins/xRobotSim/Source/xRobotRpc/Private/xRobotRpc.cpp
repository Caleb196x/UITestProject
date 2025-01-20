#include "xRobotRpc.h"

#include "kj/async-io.h"
#include "capnp/rpc-twoparty.h"
#include "capnpstub/ue_log.capnp.h"
#include "UnrealCoreServerImpl.h"

#define LOCTEXT_NAMESPACE "FRobotRpcModule"

void FRobotRpcModule::StartupModule()
{
	RpcServerRunnable = new FRpcServerRunnable();
	Thread = FRunnableThread::Create(RpcServerRunnable, TEXT("FRpcServerRunnable"));
}

void FRobotRpcModule::ShutdownModule()
{
    RpcServerRunnable->Stop();
	Thread->Kill(true);
}

bool FRpcServerRunnable::Init()
{
	bRunningServer = true;
	return true;
}

class UELogImpl final : public UELog::Server
{
public:
	kj::Promise<void> info(InfoContext context) override
	{
		auto InputMessage = context.getParams().getMessage().cStr();
		FString UEMessage = UTF8_TO_TCHAR(InputMessage);
		UE_LOG(LogTemp, Display, TEXT("Rpc: UELog %s"), *UEMessage);

		return kj::READY_NOW;
	}

	kj::Promise<void> warn(WarnContext context) override
	{
		auto InputMessage = context.getParams().getMessage().cStr();
		const FString UEMessage = UTF8_TO_TCHAR(InputMessage);
		UE_LOG(LogTemp, Warning, TEXT("Rpc: UELog %s"), *UEMessage);

		return kj::READY_NOW;
	}

	kj::Promise<void> error(ErrorContext context) override
	{
		auto InputMessage = context.getParams().getMessage().cStr();
		FString UEMessage = UTF8_TO_TCHAR(InputMessage);
		UE_LOG(LogTemp, Error, TEXT("Rpc: UELog %s"), *UEMessage);

		return kj::READY_NOW;
	}

	kj::Promise<void> fatal(FatalContext context) override
	{
		auto InputMessage = context.getParams().getMessage().cStr();
		FString UEMessage = UTF8_TO_TCHAR(InputMessage);
		UE_LOG(LogTemp, Fatal, TEXT("Rpc: UELog %s"), *UEMessage);

		return kj::READY_NOW;
	}
};

uint32 FRpcServerRunnable::Run()
{
	// do
	// {
		auto IoContext = kj::setupAsyncIo();
		kj::Network& Network = IoContext.provider->getNetwork();
		kj::Own<kj::NetworkAddress> Addr = Network.parseAddress("127.0.0.1:60001").wait(IoContext.waitScope);
		Listener = Addr->listen();

		capnp::TwoPartyServer Server(kj::heap<FUnrealCoreServerImpl>());

		FString AddrStr = UTF8_TO_TCHAR(Addr->toString().cStr());
		UE_LOG(LogTemp, Display, TEXT("Listening on %s"), *AddrStr);
		Server.listen(*Listener).wait(IoContext.waitScope);
		
	// } while(bRunningServer);

	return 0;
}

void FRpcServerRunnable::Exit()
{
	bRunningServer = false;
	Listener.attach();
	Listener = nullptr;
}

void FRpcServerRunnable::Stop()
{
	bRunningServer = false;
	Listener.attach();
	Listener = nullptr;
}

#undef LOCTEXT_NAMESPACE
    
IMPLEMENT_MODULE(FRobotRpcModule, RobotRpc)