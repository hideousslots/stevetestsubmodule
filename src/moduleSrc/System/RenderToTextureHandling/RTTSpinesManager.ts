/**
 * RTTSpinesManager.ts
 *
 * Spines handling code for use with spines on rtt sheets
 */

import * as PIXI from 'pixi.js';
import { ASSETHANDLER, ENGINE } from '../Engine';
import { PIXISpine } from '../PIXISystemClasses/PIXISpine';
import { RTTSheet, RTTSheet_ItemInfo } from './RTTSheet';

class RTTSpinesManager_Item {
	public pixiRect: PIXI.Rectangle;

	//Should have an assigned spine and an assigned slot id

	constructor(
		sheet: RTTSheet,
		public spine: PIXISpine,
		public reference: string,
		public sheetUID: number,
		public canDeallocate: boolean,
		public drawingThisFrame: boolean,
	) {
		//Presuming the sheet ID is valid, use it to pull the mask and rectangle and set the position for rendering

		if (sheetUID !== -1) {
			const sheetItem = sheet.GetItemInfoByUID(sheetUID);
			this.pixiRect = sheetItem.pixiRect;
			this.spine.mask = sheetItem.pixiMask;
			this.spine.position.set(
				this.pixiRect.x + this.pixiRect.width / 2,
				this.pixiRect.y + this.pixiRect.height / 2,
			);
		}
	}
}

type RTTSpinesManager_NewSpineOptions = {
	spineSkin: string;
	spineAnim: string;
	spineAnimShouldLoop: boolean;
	spineScale: number;
	knownSheetID: string;
	canDeallocate: boolean;
	activeNow: boolean;
};

export class RTTSpinesManager {
	//It is up to external code to create and initialise these spines
	//This code will stop/start/draw/not draw them as appropriate

	protected sheet: RTTSheet;

	//RTT system for PIXI

	protected RTTSystem: PIXI.RenderTextureSystem;

	//Spine assignment tracking

	protected activeSpines: RTTSpinesManager_Item[] = [];
	protected reallocatableSpines: RTTSpinesManager_Item[] = [];

	constructor(_sheet: RTTSheet) {
		this.sheet = _sheet;
	}

	//Assign a new spine to the the management system

	public AssignSpine(
		reference: string,
		spineResource: string,
		options: Partial<RTTSpinesManager_NewSpineOptions>,
	) {
		//Load the spine

		const spine = new PIXISpine(ASSETHANDLER.GetResource(spineResource));

		//Set skin, anim, etc?

		if (options.spineSkin !== undefined) {
			spine.SetSkin(options.spineSkin);
		}
		if (options.spineAnim !== undefined) {
			spine.SetAnimation(
				options.spineAnim,
				options.spineAnimShouldLoop !== undefined
					? options.spineAnimShouldLoop
					: false,
			);
		}
		if (options.spineScale !== undefined) {
			spine.scale.set(options.spineScale);
		}

		//Determine if it has a known allocation space to use or

		let sheetUID: number = -1;
		if (options.knownSheetID !== undefined) {
			const item = this.sheet.GetItemInfoByID(options.knownSheetID);
			if (item !== undefined) {
				sheetUID = item.uniqueID;
			}
		} else {
			//Allocate a fresh item for this spine (to be done)
		}

		let canDeallocate: boolean =
			options.canDeallocate !== undefined ? options.canDeallocate : true;

		//Create the managed instance

		const newItem = new RTTSpinesManager_Item(
			this.sheet,
			spine,
			reference,
			sheetUID,
			canDeallocate,
			false,
		);

		//Assign it to the active or reallocatable pool as needed

		if (options.activeNow) {
			this.activeSpines.push(newItem);
		} else {
			this.reallocatableSpines.push(newItem);
		}
	}

	public UpdateCurrentSpines(IDlist: string[], delta: number, now: number) {
		//Go through all active items, and prepare to draw each as needed

		const container = new PIXI.Container();

		if (this.RTTSystem === undefined) {
			this.RTTSystem = new PIXI.RenderTextureSystem(ENGINE.GetRenderer());
		}

		this.activeSpines.forEach((item) => {
			//If the item is in use, update it

			if (
				IDlist.findIndex((existing) => {
					return existing === item.reference;
				}) !== -1
			) {
				container.addChild(item.spine);
				this.RTTSystem.bind(
					this.sheet.GetTexture(),
					item.pixiRect,
					item.pixiRect,
				);
				this.RTTSystem.clear();
			}
		});
		ENGINE.GetRenderer().render(container, {
			renderTexture: this.sheet.GetTexture(),
			clear: false,
		});

		container.destroy();
		this.RTTSystem.reset();
	}
}
