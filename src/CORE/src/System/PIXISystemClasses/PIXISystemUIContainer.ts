/**
 * PIXISystemDebugContainer.ts
 *
 * Code to handle debug functions in a root container
 *
 * Some function exposed to application
 */

import * as PIXI from 'pixi.js';
import { PIXILimitsBox } from './PIXILimitsBox';
import { SCREENMANAGER } from '../Engine';
import {
	ScreenManager,
	Screen_LayoutData,
	Screen_Orientation,
} from '../ScreenHandling/ScreenManager';

import { PIXISystemRootContainer } from './PIXISystemRootContainer';

export enum PIXISYSTEMUI_ANCHORID {
	TOPLEFT = 0,
	TOPMIDDLE,
	TOPRIGHT,
	LEFT,
	CENTER,
	RIGHT,
	BOTTOMLEFT,
	BOTTOMMIDDLE,
	BOTTOMRIGHT,
	COUNT,
}

export enum PIXISYSTEMUI_STYLE {
	FIXEDRATIO = 'fixedratio',
	VISIBLEBOUNDS = 'visiblebounds',
}

export class PIXISystemUIContainer extends PIXISystemRootContainer {
	protected anchors: PIXI.Container[] = [];
	protected style: PIXISYSTEMUI_STYLE;

	constructor(width: number, height: number, style: PIXISYSTEMUI_STYLE) {
		//Handle creation of the normal container

		super(width, height);

		//Create the anchor holders

		for (let i = 0; i < PIXISYSTEMUI_ANCHORID.COUNT; i++) {
			const holder: PIXI.Container = new PIXI.Container();

			const graphics = new PIXI.Graphics();
			graphics.lineStyle(5, 0x00ff00);
			graphics.drawCircle(0, 0, 5);
			holder.addChild(graphics);

			this.anchors[i] = holder;
			this.addChild(this.anchors[i]);
		}

		this.SetStyle(style);
	}

	//Public functions

	public SetStyle(style: PIXISYSTEMUI_STYLE) {
		this.style = style;

		//Rebuild positions based on screen manager info

		const screenData = SCREENMANAGER.GetScreenLayoutData();

		this.SetAnchorPositions(
			screenData.width,
			screenData.height,
			screenData.offsetX,
			screenData.offsetY,
		);
	}

	public GetAnchor(id: PIXISYSTEMUI_ANCHORID): PIXI.Container {
		return this.anchors[id];
	}

	//Internal handling

	protected SetAnchorPositions(
		refWidth: number,
		refHeight: number,
		extensionX: number,
		extensionY: number,
	) {
		let top = 0;
		let bot = refHeight;
		let left = 0;
		let right = refWidth;

		if (this.style === PIXISYSTEMUI_STYLE.VISIBLEBOUNDS) {
			top -= extensionY;
			bot -= extensionY;
			left -= extensionX;
			right -= extensionX;
		} else {
			bot -= extensionY * 2;
			right -= extensionX * 2;
		}

		this.anchors[PIXISYSTEMUI_ANCHORID.TOPLEFT].position.set(left, top);
		this.anchors[PIXISYSTEMUI_ANCHORID.TOPMIDDLE].position.set(
			(left + right) / 2,
			top,
		);
		this.anchors[PIXISYSTEMUI_ANCHORID.TOPRIGHT].position.set(right, top);
		this.anchors[PIXISYSTEMUI_ANCHORID.LEFT].position.set(
			left,
			(top + bot) / 2,
		);
		this.anchors[PIXISYSTEMUI_ANCHORID.CENTER].position.set(
			(left + right) / 2,
			(top + bot) / 2,
		);
		this.anchors[PIXISYSTEMUI_ANCHORID.RIGHT].position.set(
			right,
			(top + bot) / 2,
		);
		this.anchors[PIXISYSTEMUI_ANCHORID.BOTTOMLEFT].position.set(left, bot);
		this.anchors[PIXISYSTEMUI_ANCHORID.BOTTOMMIDDLE].position.set(
			(left + right) / 2,
			bot,
		);
		this.anchors[PIXISYSTEMUI_ANCHORID.BOTTOMRIGHT].position.set(
			right,
			bot,
		);
	}

	protected HandleResizeCallback(screenData: Screen_LayoutData) {
		super.HandleResizeCallback(screenData);

		//Change the position of the anchors

		this.SetAnchorPositions(
			screenData.width,
			screenData.height,
			screenData.offsetX,
			screenData.offsetY,
		);
	}
}
