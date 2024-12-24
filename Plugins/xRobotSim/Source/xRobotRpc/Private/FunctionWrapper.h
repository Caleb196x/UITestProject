#pragma once
#include <any>
#include <memory>
#include <vector>

#include "PropertyWrapper.h"

namespace xRobotRpc
{
	class FFunctionWrapper
	{
	public:
		explicit FFunctionWrapper(UFunction* InFunction) : Function(InFunction)
		{
			Init(InFunction);
		}

		void Call(UObject* CallObject, const std::vector<std::any>& Params, std::vector<std::any>& Outputs/*第0个元素是return的返回值*/);

		void CallStatic(const std::vector<std::any>& Params, std::vector<std::any>& Outputs);

		FString GetName() const { return Function->GetName(); }

		bool IsStaticFunc() const
		{
			return bIsStatic;
		}
		
	private:
		void Init(UFunction* InFunction, bool bIsDelegate = false);

		void SlowCall();

		void FastCall();

		bool bIsStatic;

		bool bSkipWorldContextInArg0;

		bool bIsInterfaceFunction;

		uint32 ParamsBufferSize;
		
		UFunction* Function;

		UObject* DefaultBindObject;

		void* ArgumentDefaultValues;

		std::vector<std::unique_ptr<FPropertyWrapper>> Arguments;

		std::unique_ptr<FPropertyWrapper> Return;
	};
}

