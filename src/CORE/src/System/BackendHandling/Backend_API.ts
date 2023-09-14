/**
 * Backend_API.ts
 *
 * API for the server backend
 */

import {
	BackendResponse_Init_Base,
	BackendResponse_Play_Base,
	BackendResponse_Continue_Base,
	BackendResponse_Complete_Base,
} from './Backend_Defines';

export abstract class Backend_API {
	readonly ID: string;
	public abstract IsAvailable(): boolean;
	public abstract Install(settings: any): Promise<void>;

	public abstract Initialise(): Promise<BackendResponse_Init_Base>;
	public abstract Play(
		mode: string,
		stake: number,
	): Promise<BackendResponse_Play_Base>;
	public abstract Continue(): Promise<BackendResponse_Continue_Base>;
	public abstract Complete(): Promise<BackendResponse_Complete_Base>;
}
