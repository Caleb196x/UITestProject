#pragma once

namespace xRobotRpc
{
	class FPropertyWrapper
	{
	public:
		explicit FPropertyWrapper(FProperty* InProperty) : Property(InProperty) {}

	private:
		FProperty* Property;
	};
}
