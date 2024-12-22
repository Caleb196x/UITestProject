#pragma once
#include <exception>
#include <string>

namespace xRobotRpc
{
	class FRuntimeRpcException : public std::exception
	{
	public:
		FRuntimeRpcException(const char* file, int line, const char* msg)
				: m_file(file), m_line(line), m_msg(msg) {}

		FRuntimeRpcException(const char* file, int line, FString msg)
				: m_file(file), m_line(line), m_msg(TCHAR_TO_UTF8(*msg)) {}

		FRuntimeRpcException(const char* file, int line, std::string msg)
				: m_file(file), m_line(line), m_msg(msg.c_str()) {}
		
		const char* what() const noexcept override { return m_msg; }
		const char* file() const noexcept { return m_file; }
		int line() const noexcept { return m_line; }
		
	private:
		const char* m_file;
		int m_line;
		const char* m_msg;
	};

}


#define ThrowRuntimeRpcException(Message) \
	throw xRobotRpc::FRuntimeRpcException(__FILE__, __LINE__, Message)
