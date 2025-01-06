#include "ue_core.capnp.h"
#include <kj/async-io.h>
#include <capnp/rpc-twoparty.h>
#include <kj/debug.h>
#include <iostream>
#include <capnp/dynamic.h>

class MyObject
{
public:
    MyObject(UnrealCore::Client* InClient, kj::WaitScope* inWaitScope) :
        Client(InClient), waitScope(inWaitScope)
    {
        auto request = Client->newObjectRequest();
        request.getClass().setTypeName("MyObject");
        request.getOuter().setAddress(reinterpret_cast<uint64_t>(this));
        request.getOuter().setName("MyObject");

        request.setFlags(0x00);
        request.setObjName("TestMyObject");
        auto promise = request.send();
        auto result = promise.wait(*waitScope);
        uint64_t addr = result.getObject().getAddress();
        UEObjectPtr = reinterpret_cast<void*>(addr);
        const auto name = result.getObject().getName();
        std::cout << "object name created by ue: " << name.cStr() << ", ue object ptr: " << std::hex << UEObjectPtr << std::endl;
    }

    ~MyObject()
    {
        auto destroyRequest = Client->destroyObjectRequest();
        destroyRequest.initOuter().setAddress(reinterpret_cast<uint64_t>(this));

        auto promise = destroyRequest.send();
        auto res = promise.wait(*waitScope);
        if (res.getResult())
        {
            std::cout << "Destroy object success \n";
        }
        else
        {
            std::cout << "Destroy object failed \n";
        }
    }

    int32_t Add(int32_t a, int32_t b)
    {
        auto callReq = Client->callFunctionRequest();
        auto outer = callReq.initOuter();
        outer.setAddress(reinterpret_cast<uint64_t>(this));
        outer.setName("TestMyObject");

        auto callObject = callReq.initCallObject();
        callObject.setAddress(reinterpret_cast<uint64_t>(UEObjectPtr));

        callReq.initClass().setTypeName("MyObject");
        callReq.setFuncName("Add");

        auto Params = callReq.initParams(2);
        Params[0].setIntValue(a);
        Params[1].setIntValue(b);

        auto result = callReq.send().wait(*waitScope);
        auto callRes = result.getReturn();
        return static_cast<int32_t>(callRes.getIntValue());
    }
    
private:
    static uint64_t ObjectIndex;
    UnrealCore::Client* Client;
    void* UEObjectPtr;
    kj::WaitScope* waitScope;
};

uint64_t MyObject::ObjectIndex = 0;

int main()
{
    std::cout << "run ue core client test code listening 127.0.0.1:6003" << std::endl;

    auto io = kj::setupAsyncIo();
    auto& waitScope = io.waitScope;
    kj::Network& network = io.provider->getNetwork();
    kj::Own<kj::NetworkAddress> addr = network.parseAddress("127.0.0.1:6003").wait(waitScope);
    kj::Own<kj::AsyncIoStream> conn = addr->connect().wait(waitScope);

    // Now we can start the Cap'n Proto RPC system on this connection.
    capnp::TwoPartyClient client(*conn);

    UnrealCore::Client unreal_core = client.bootstrap().castAs<UnrealCore>();

    {
        std::cout << "Test new object" << std::endl;

        MyObject* Object =  new MyObject(&unreal_core, &waitScope);
        Object->Add(1, 2);
    }
}
