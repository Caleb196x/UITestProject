#pragma once

namespace xRobotRpc
{
	class FFunctionWrapper
	{
	public:
		explicit FFunctionWrapper(UFunction* InFunction) : Function(InFunction)
		{
			Init(InFunction);
		}

		void Call();

		bool IsStaticFunc() const
		{
			return bIsStatic;
		}
		
	private:
		void Init(UFunction* InFunction);

		void SlowCall();

		void FastCall();

		bool bIsStatic;

		bool bSkipWorldContextInArg0;

		bool bIsInterfaceFunction;

		uint32 ParamsBufferSize;
		
		UFunction* Function;
	};
}

