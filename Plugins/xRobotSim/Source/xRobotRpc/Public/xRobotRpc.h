#pragma once

#include "CoreMinimal.h"
#include "Modules/ModuleManager.h"
#include "kj/async-io.h"

class FRpcServerRunnable : public FRunnable
{
public:
    virtual uint32 Run() override;
    virtual void Stop() override;
    virtual void Exit() override;
    virtual bool Init() override;

    virtual ~FRpcServerRunnable() noexcept override { }
private:
    bool bRunningServer = false;

    kj::Own<kj::ConnectionReceiver> Listener;
};

class FRobotRpcModule : public IModuleInterface
{
public:
    virtual void StartupModule() override;
    virtual void ShutdownModule() override;

private:
    FRunnableThread* Thread = nullptr;
    FRpcServerRunnable* RpcServerRunnable = nullptr;
};
