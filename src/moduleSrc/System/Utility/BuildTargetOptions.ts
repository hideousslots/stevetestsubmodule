/**
 * BuildTargetOptions.ts
 *
 * Handling of config for buildtarget configs
 */

export class BuildTargetOptions {
	private config: any;

	constructor(newConfig: any) {
		if (BUILDTARGETOPTIONS !== undefined) {
			return;
		}
		BUILDTARGETOPTIONS = this;
		this.config = newConfig;
	}

	public DebugShowConfig(): string {
		return JSON.stringify(this.config);
	}

	public IsSet(id: string): boolean {
		if (this.config[id] === undefined) {
			return false;
		}

		return this.config[id];
	}

	public GetString(id: string): string {
		if (this.config[id] === undefined) {
			console.log('BuildTarget ' + id + ' not set');
			return '';
		}
		return this.config[id];
	}
}

let BUILDTARGETOPTIONS: BuildTargetOptions;
export { BUILDTARGETOPTIONS };
