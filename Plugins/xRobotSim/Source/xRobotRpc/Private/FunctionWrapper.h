#pragma once
#include <any>
#include <memory>
#include <string>
#include <map>
#include <vector>

#include "PropertyWrapper.h"

class FFunctionWrapper
{
public:
	explicit FFunctionWrapper(UFunction* InFunction) : Function(InFunction)
	{
		Init(InFunction);
	}

	void Call(UObject* CallObject, const std::vector<void*>& Params,
		std::vector<std::pair<std::string /*rpc type*/, std::pair<std::string/*ue type*/, void*>>>& Outputs/*第0个元素是return的返回值*/);

	void CallStatic(const std::vector<void*>& Params,
		std::vector<std::pair<std::string /*rpc type*/, std::pair<std::string/*ue type*/, void*>>>& Outputs);

	FString GetName() const { return Function->GetName(); }

	bool IsStaticFunc() const
	{
		return bIsStatic;
	}
	
private:
	void Init(UFunction* InFunction, bool bIsDelegate = false);

	void SlowCall() {}

	void FastCall(UObject* CallObject, UFunction* CallFunction, const std::vector<void*>& Params,
		std::vector<std::pair<std::string /*rpc type*/, std::pair<std::string/*ue type*/, void*>>>& Outputs,
		void* StackParams) const;
	

	bool bIsStatic;

	bool bSkipWorldContextInArg0;

	bool bIsInterfaceFunction;
	
#if WITH_EDITOR
	FName FunctionName;
#endif
	
	uint32 ParamsBufferSize;
	
	UFunction* Function;

	UObject* DefaultBindObject;

	void* ArgumentDefaultValues;

	std::vector<std::unique_ptr<FPropertyWrapper>> Arguments;

	std::unique_ptr<FPropertyWrapper> Return;
};


