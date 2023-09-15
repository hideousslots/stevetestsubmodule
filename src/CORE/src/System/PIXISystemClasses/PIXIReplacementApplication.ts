/**
 * PIXIReplacementApplication.ts
 *
 * Alternative for PIXI's application that allows us to change some functionality
 */

import * as PIXI from 'pixi.js';

export class PIXIReplacementApplication extends PIXI.Application {
	public renderViaEngine: boolean = false; //Allow render to be called by engine

	public render() {
		//console.log('intercept render');
		if (!this.renderViaEngine) {
			super.render();
		}
	}

	//If using renderViaEngine using the postbeat heartbeat timer to call this

	public engineDrivenRender = () => {
		super.render();
	};
}
