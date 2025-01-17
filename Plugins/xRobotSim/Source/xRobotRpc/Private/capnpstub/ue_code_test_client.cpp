#include "ue_core.capnp.h"
#include <kj/async-io.h>
#include <capnp/rpc-twoparty.h>
#include <kj/debug.h>
#include <iostream>
#include <capnp/dynamic.h>

struct Vector2D
{
    Vector2D(UnrealCore::Client* InClient, kj::WaitScope* inWaitScope) :
        Client(InClient), waitScope(inWaitScope)
    {
        auto request = Client->newObjectRequest();
        request.getUeClass().setTypeName("Vector2D");
        request.getOuter().setAddress(reinterpret_cast<uint64_t>(this));
        request.setFlags(0x00);
        request.setObjName("TestVector2D");
        auto ConstructArgs = request.initConstructArgs(2);

        ConstructArgs[0].setName("X");
        ConstructArgs[0].setFloatValue(1.0f);

        ConstructArgs[1].setName("Y");
        ConstructArgs[1].setFloatValue(2.0f);

        auto promise = request.send();
        auto result = promise.wait(*waitScope);
        uint64_t addr = result.getObject().getAddress();
        UEObjectPtr = reinterpret_cast<void*>(addr);
        const auto name = result.getObject().getName();
        std::cout << "construct vector2d created by ue: " << name.cStr() << ", ue object ptr: " << std::hex << UEObjectPtr << std::endl;
    }

    ~Vector2D()
    {
        auto destroyRequest = Client->destroyObjectRequest();
        destroyRequest.initOuter().setAddress(reinterpret_cast<uint64_t>(this));

        auto promise = destroyRequest.send();
        auto res = promise.wait(*waitScope);
        if (res.getResult())
        {
            std::cout << "Destroy vector2d success \n";
        }
        else
        {
            std::cout << "Destroy vector2d failed \n";
        }
    }

    void SetX(double InX)
    {
        X = InX;
        auto SetPropReq = Client->setPropertyRequest();
        SetPropReq.initUeClass().setTypeName("Vector2D");
        SetPropReq.initOwner().setName("TestVector2D");
        SetPropReq.initOwner().setAddress(reinterpret_cast<uint64_t>(this));
        auto Prop = SetPropReq.initProperty();
        Prop.setName("X");
        Prop.setFloatValue(InX);

        SetPropReq.send().wait(*waitScope);
    }

    double GetX()
    {
        auto GetPropReq = Client->getPropertyRequest();
        GetPropReq.initUeClass().setTypeName("Vector2D");
        GetPropReq.initOwner().setName("TestVector2D");
        GetPropReq.initOwner().setAddress(reinterpret_cast<uint64_t>(this));
        GetPropReq.setPropertyName("X");

        auto Result = GetPropReq.send().wait(*waitScope);
        X= Result.getProperty().getFloatValue();
        return X;
    }

    void SetY(double InY)
    {
        Y = InY;
        auto SetPropReq = Client->setPropertyRequest();
        SetPropReq.initUeClass().setTypeName("Vector2D");
        SetPropReq.initOwner().setName("TestVector2D");
        SetPropReq.initOwner().setAddress(reinterpret_cast<uint64_t>(this));
        auto Prop = SetPropReq.initProperty();
        Prop.setName("Y");
        Prop.setFloatValue(InY);

        SetPropReq.send().wait(*waitScope);
    }

    double GetY()
    {
        auto GetPropReq = Client->getPropertyRequest();
        GetPropReq.initUeClass().setTypeName("Vector2D");
        GetPropReq.initOwner().setName("TestVector2D");
        GetPropReq.initOwner().setAddress(reinterpret_cast<uint64_t>(this));
        GetPropReq.setPropertyName("Y");

        auto Result = GetPropReq.send().wait(*waitScope);
        Y= Result.getProperty().getFloatValue();
        return Y;
    }

    double X;
    double Y;

    UnrealCore::Client* Client;
    void* UEObjectPtr;
    kj::WaitScope* waitScope;
};

class MyObject
{
public:
    MyObject(UnrealCore::Client* InClient, kj::WaitScope* inWaitScope) :
        Client(InClient), waitScope(inWaitScope)
    {
        auto request = Client->newObjectRequest();
        request.getUeClass().setTypeName("MyObject");
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

        callReq.initUeClass().setTypeName("MyObject");
        callReq.setFuncName("Add");

        auto Params = callReq.initParams(2);
        Params[0].setIntValue(a);
        Params[1].setIntValue(b);

        auto result = callReq.send().wait(*waitScope);
        auto callRes = result.getReturn();
        return static_cast<int32_t>(callRes.getIntValue());
    }

    int32_t TestVector(Vector2D* vector)
    {
        auto callReq = Client->callFunctionRequest();
        auto outer = callReq.initOuter();
        outer.setAddress(reinterpret_cast<uint64_t>(this));
        outer.setName("TestMyObject");

        auto callObject = callReq.initCallObject();
        callObject.setAddress(reinterpret_cast<uint64_t>(UEObjectPtr));

        callReq.initUeClass().setTypeName("MyObject");
        callReq.setFuncName("TestVector");

        auto Params = callReq.initParams(1);
        Params[0].initObject().setAddress(reinterpret_cast<uint64_t>(vector));
        auto Result = callReq.send().wait(*waitScope);
        auto CallRes = Result.getReturn();
        return static_cast<int32_t>(CallRes.getIntValue());
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
    UnrealCore::Client* unreal_core_client = nullptr;
    try{
        kj::Own<kj::NetworkAddress> addr = network.parseAddress("127.0.0.1:6003").wait(waitScope);
        kj::Own<kj::AsyncIoStream> conn = addr->connect().wait(waitScope);
        capnp::TwoPartyClient client(*conn);

        UnrealCore::Client unreal_core = client.bootstrap().castAs<UnrealCore>();
    }catch(kj::Exception& e){
        std::cout << "connect error" << e.getDescription().cStr() << std::endl;
        return -1;
    }


    // Now we can start the Cap'n Proto RPC system on this connection.
    // capnp::TwoPartyClient client(*conn);

    // UnrealCore::Client unreal_core = client.bootstrap().castAs<UnrealCore>();

    {
        std::cout << "Test new object" << std::endl;

        MyObject* Object =  new MyObject(unreal_core_client, &waitScope);
        int32_t Res = Object->Add(1, 2);
        std::cout << "Add result: " << Res << std::endl;

        std::cout << "Call param vector function TestVector" << std::endl;
        Vector2D vector_2d(unreal_core_client, &waitScope);
        vector_2d.SetX(4.0f);
        vector_2d.SetY(5.0f);
        Res = Object->TestVector(&vector_2d);
        std::cout << "TestVector result: " << Res << std::endl;
    }

    {
        Vector2D vector_2d(unreal_core_client, &waitScope);
        std::cout << "before set property: ";
        double X = vector_2d.GetX();
        double Y = vector_2d.GetY();
        std::cout << "X: " << X << ", Y: " << Y << std::endl;
        vector_2d.SetX(5.0f);
        vector_2d.SetY(6.0f);
        std::cout << "after set property: ";
        X = vector_2d.GetX();
        Y = vector_2d.GetY();
        std::cout << "X: " << X << ", Y: " << Y << std::endl;
        
    }
}
