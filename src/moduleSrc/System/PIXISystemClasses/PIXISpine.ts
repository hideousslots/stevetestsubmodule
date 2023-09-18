/**
 * PIXISpine.ts
 *
 * Extension of pixi's standard spine. This is to make it more usable for RTT and other cases
 */
import * as PIXI from 'pixi.js';
import { Spine } from 'pixi-spine';

export class PIXISpine extends Spine {
	constructor(_json: any) {
		super(_json.spineData);
	}

	public SetSkin(name: string) {
		this.skeleton.setSkinByName(name);
		this.skeleton.setToSetupPose();
	}

	public SetAnimation(name: string, loop: boolean) {
		this.state.setAnimation(0, name, loop);
	}
}
