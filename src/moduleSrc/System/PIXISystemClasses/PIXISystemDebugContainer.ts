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
	Screen_LayoutData,
	Screen_Orientation,
} from '../ScreenHandling/ScreenManager';

import { PIXISystemRootContainer } from './PIXISystemRootContainer';
import { PIXISystemDebugButton } from './PIXISystemDebugButton';
import { UIBUTTONDEFINES } from '../UISupport/UIButtonDefines';

export interface Debug_LimitParams {
	width: number;
	height: number;
	landscapeColour: number;
	portraitColour: number;
	alpha?: number;
	thickness?: number;
	centerX?: number;
	centerY?: number;
}

export class PIXISystemDebugContainer extends PIXISystemRootContainer {
	protected debug_LandscapeLimits: PIXILimitsBox[] = [];
	protected debug_PortraitLimits: PIXILimitsBox[] = [];
	protected debug_TextHolder: PIXI.Container;
	protected debug_ButtonHolder: PIXI.Container;
	protected debug_Buttons: PIXISystemDebugButton[] = [];
	protected debug_Texts: PIXI.Text[] = [];
	protected static debug_LimitNextUID: number = 0;

	constructor(
		width: number,
		height: number,
		debugTextCount: number,
		debugButtonCount: number,
	) {
		//Handle creation of the normal container

		super(width, height);

		//Set text

		this.debug_TextHolder = new PIXI.Container();
		this.addChild(this.debug_TextHolder);
		for (let i = 0; i < debugTextCount; i++) {
			const newText = new PIXI.Text('', {
				fontFamily: 'Arial',
				fontSize: 32,
				fill: 0xffffff,
				align: 'center',
			});
			this.debug_TextHolder.addChild(newText);
			newText.alpha = 0.75;
			newText.position.set(0, 48 * i);
			this.debug_Texts[i] = newText;
		}

		//Set debug buttons

		this.debug_ButtonHolder = new PIXI.Container();
		this.addChild(this.debug_ButtonHolder);
		const buttonColours = [0xff0000, 0x00ff00, 0x0000ff, 0x00ffff];
		for (let i = 0; i < debugButtonCount; i++) {
			const newButton = new PIXISystemDebugButton(
				i * 80,
				0,
				64,
				64,
				buttonColours[i % buttonColours.length],
				UIBUTTONDEFINES.UIDEBUGBUTTON_X + i,
			);
			newButton.alpha = 0.2;
			this.debug_ButtonHolder.addChild(newButton);
		}
	}

	//Public functions

	public SetDebugText(index: number, value: string) {
		if (index < this.debug_Texts.length) {
			this.debug_Texts[index].text = value;
		}
	}

	public AddDebugLimit(settings: Debug_LimitParams): number {
		const UID = PIXISystemDebugContainer.debug_LimitNextUID++;
		this.AddDebugLimitsInternal(
			UID,
			settings.width,
			settings.height,
			settings.landscapeColour,
			settings.portraitColour,
			settings.alpha !== undefined ? settings.alpha : 1,
			settings.thickness !== undefined ? settings.thickness : 1,
			settings.centerX,
			settings.centerY,
		);
		return UID;
	}

	public RemoveDebugLimit(UID: number) {
		//Remove all limit boxes with the given UID

		let removeIndex: number = this.debug_LandscapeLimits.findIndex(
			(existing) => {
				return existing.UID === UID;
			},
		);
		if (removeIndex !== -1) {
			const remove = this.debug_LandscapeLimits.splice(removeIndex, 1)[0];
			this.removeChild(remove);
		}

		removeIndex = this.debug_PortraitLimits.findIndex((existing) => {
			return existing.UID === UID;
		});
		if (removeIndex !== -1) {
			const remove = this.debug_PortraitLimits.splice(removeIndex, 1)[0];
			this.removeChild(remove);
		}
	}

	//Internal handling

	protected AddDebugLimitsInternal(
		UID: number,
		width: number,
		height: number,
		landscapeColour: number,
		portraitColour: number,
		alpha: number,
		thickness: number,
		centerX?: number,
		centerY?: number,
	) {
		const layoutData = SCREENMANAGER.GetScreenLayoutData();

		//Create (if needed) debug limits boxes

		const landscapeLimit: PIXILimitsBox = new PIXILimitsBox({
			UID: UID,
			centerX: centerX ? centerX : width / 2,
			centerY: centerY ? centerY : height / 2,
			width: width,
			height: height,
			lineWidth: thickness,
			colour: landscapeColour,
			alpha: alpha,
		});

		landscapeLimit.visible =
			layoutData.orientation === Screen_Orientation.Landscape;
		this.debug_LandscapeLimits.push(landscapeLimit);
		this.addChild(landscapeLimit);

		const portraitLimit: PIXILimitsBox = new PIXILimitsBox({
			UID: UID,
			centerX: centerY ? centerY : height / 2,
			centerY: centerX ? centerX : width / 2,
			width: height,
			height: width,
			lineWidth: thickness,
			colour: portraitColour,
			alpha: alpha,
		});
		portraitLimit.visible =
			layoutData.orientation === Screen_Orientation.Portrait;
		this.debug_PortraitLimits.push(portraitLimit);
		this.addChild(portraitLimit);
	}

	protected HandleResizeCallback(screenData: Screen_LayoutData) {
		super.HandleResizeCallback(screenData);

		//Reset debug lines

		if (this.debug_LandscapeLimits.length !== 0) {
			this.debug_LandscapeLimits.forEach((limit) => {
				limit.visible =
					screenData.orientation === Screen_Orientation.Landscape;
			});
		}

		if (this.debug_PortraitLimits !== undefined) {
			this.debug_PortraitLimits.forEach((limit) => {
				limit.visible =
					screenData.orientation === Screen_Orientation.Portrait;
			});
		}

		//Adjust the bounds for the text to occupy the extra spaces too

		this.debug_TextHolder.position.set(
			-screenData.offsetX,
			-screenData.offsetY,
		);

		this.debug_ButtonHolder.position.set(
			-screenData.offsetX / 2 + screenData.centerX,
			-screenData.offsetY,
		);
	}
}
