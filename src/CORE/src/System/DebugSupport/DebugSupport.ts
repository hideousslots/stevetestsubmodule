/**
 * DebugSupport.ts
 *
 * Public debug class for application to use
 */

import { HEARTBEAT, PLATFORMSUPPORT } from '../Engine';

import {
	Debug_LimitParams,
	PIXISystemDebugContainer,
} from '../PIXISystemClasses/PIXISystemDebugContainer';

import { BUILDTARGETOPTIONS } from '../Utility/BuildTargetOptions';

export class DebugSupport {
	constructor(protected debugContainer: PIXISystemDebugContainer) {}

	//Decide if debug is working based on both the buildtarget settings and the URL

	protected CheckIsDebug(): boolean {
		return (
			BUILDTARGETOPTIONS.IsSet('debugavailable') &&
			PLATFORMSUPPORT.CheckURLParameterExists('debug')
		);
	}

	//Text

	public SetText(index: number, text: string) {
		if (this.CheckIsDebug()) {
			this.debugContainer.SetDebugText(index, text);
		}
	}

	//Limit box

	public AddLimitBox(settings: Debug_LimitParams): number {
		if (!this.CheckIsDebug()) {
			return -1;
		}

		return this.debugContainer.AddDebugLimit(settings);
	}

	public RemoveLimitBox(UID: number) {
		if (this.CheckIsDebug()) {
			this.debugContainer.RemoveDebugLimit(UID);
		}
	}

	//Get heartbeat tick list

	public ReportHeartbeatList() {
		if (this.CheckIsDebug) {
			console.log('Heartbeat ticks: ');
			HEARTBEAT.Debug_GetRunOrder().forEach((item) => {
				console.log(item);
			});
		}
	}
}
