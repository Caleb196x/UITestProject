#pragma once
#include <memory>

namespace xRobotRpc
{
	class FPropertyWrapper
	{
	public:
		explicit FPropertyWrapper(FProperty* InProperty) : Property(InProperty) {}

		static std::unique_ptr<FPropertyWrapper> Create(FProperty* InProperty, bool bIgnoreOutput = false);
	private:
		FProperty* Property;
	};
}
