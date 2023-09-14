/**
 * Backend_Defines.ts
 *
 * Structures for backend setups and interfacing
 */

export interface BackendResponse_Init_Base {
	serverID: string;
	serverVersion: string;
	gameID: string;
}

export interface BackendResponse_Play_Base {
    data: any
}

export interface BackendResponse_Continue_Base {
    data: any
}

export interface BackendResponse_Complete_Base {
    data: any
}
