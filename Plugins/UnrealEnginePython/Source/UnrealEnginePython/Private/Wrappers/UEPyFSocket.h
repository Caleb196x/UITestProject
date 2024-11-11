#pragma once

#include "UnrealEnginePython.h"

#include "Runtime/Sockets/Public/Sockets.h"
#include "Runtime/Networking/Public/Networking.h"



struct ue_PyFSocket {
	PyObject_HEAD
	/* Type-specific fields go here. */
	FSocket *sock;
	FUdpSocketReceiver *udp_receiver;
	static void udp_recv(const FArrayReaderPtr& ArrayReaderPtr, const FIPv4Endpoint& EndPt) {
		UE_LOG(LogPython, Warning, TEXT("DATA !!!"));
	}
};

void ue_python_init_fsocket(PyObject *);