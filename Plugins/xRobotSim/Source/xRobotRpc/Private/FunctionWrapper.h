#pragma once
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

		void Call(UObject* CallObject, void* Params);

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

		void* ArgumentDefaultValues;

		std::vector<std::unique_ptr<FPropertyWrapper>> Arguments;

		std::unique_ptr<FPropertyWrapper> Return;
	};
}

