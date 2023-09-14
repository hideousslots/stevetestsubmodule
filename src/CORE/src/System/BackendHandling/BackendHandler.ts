/**
 * BackendHandler.ts
 *
 * Code which issues and interfaces to the required backend system
 */

import { Backend_API } from './Backend_API';
import { BUILDTARGETOPTIONS } from '../Utility/BuildTargetOptions';

import {
	TequityBackend_FakeLocal,
	TEQUITY_FAKELOCAL_CONFIG,
} from './BackendsAvailable/Tequity/TequityBackend_FakeLocal';

//Available backends go here

const availableBackends: {
	[key: string]: { implementation: typeof Backend_API; config: any };
} = {};

export class BackendHandler {
	constructor() {}

	public loaded: boolean = false;
	protected backend: Backend_API;

	public async Init(): Promise<void> {
		//Determine which backend we should be using the URL and build configs

		let backendID: string = BUILDTARGETOPTIONS.GetString('backendID');

		//Can the ID be overridden by URL?

		if (BUILDTARGETOPTIONS.IsSet('canoverridebackendID')) {
			//Override with the backendid in the URL if present

			const currentURL = new URL(window.location.href);
			currentURL.searchParams.forEach((value, key) => {
				if (key === 'backend') {
					backendID = value;
				}
			});
		}

		console.log('SNC BACKENDID CONFIRMED AS ' + backendID);

		//Find the correct API

		this.backend = new TequityBackend_FakeLocal();
		this.backend.Install(TEQUITY_FAKELOCAL_CONFIG);
	}
}
