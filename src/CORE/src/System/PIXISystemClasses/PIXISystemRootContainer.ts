/**
 * PIXISystemRootContainer.ts
 *
 * Code to handle the root containers - this are system managed and hold the background and game for the game
 */

import * as PIXI from 'pixi.js';
import { PIXILimitsBox } from './PIXILimitsBox';
import { SCREENMANAGER } from '../Engine';
import {
	Screen_LayoutData,
	Screen_Orientation,
} from '../ScreenHandling/ScreenManager';

export class PIXISystemRootContainer extends PIXI.Container {
	constructor(width: number, height: number) {
		//Handle creation of the normal container

		super();
	}

	public SetResizeCallback() {
		SCREENMANAGER.AddResizeCallback(this.ResizeCallback);
		this.ResizeCallback(SCREENMANAGER.GetScreenLayoutData());
	}

	protected HandleResizeCallback(screenData: Screen_LayoutData) {
		this.position.x = screenData.offsetX;
		this.position.y = screenData.offsetY;
	}

	protected ResizeCallback = (screenData: Screen_LayoutData) => {
		this.HandleResizeCallback(screenData);
	};
}
