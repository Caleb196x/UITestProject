#pragma once

#include <string>

class FUnrealPythonRpcUtils
{
public:
	static FString ToFString(const std::string& InString)
	{
		return ToFString(InString.c_str());
	}

	static FString ToFString(const char* InString)
	{
		return UTF8_TO_TCHAR(InString);
	}

	static FString ToFString(const std::wstring& InString)
	{
		return ToFString(InString.c_str());
	}

	static FString ToFString(const wchar_t* InString)
	{
		return UTF16_TO_TCHAR(InString);
	}
};
