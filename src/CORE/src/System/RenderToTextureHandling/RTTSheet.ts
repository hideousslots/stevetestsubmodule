/**
 * RTTSheet.ts
 *
 * Render to texture sheet handling for matchup of name to sheet x,y,u,v data
 */

import * as PIXI from 'pixi.js';

export type RTTSheet_ItemInfo = {
	uniqueID: number;
	ID: string;
	pixiRect: PIXI.Rectangle; //Used for overwrite via render to texture
	pixiMask: PIXI.Graphics; //Used for overwrite via render to texture
	minU: number;
	minV: number;
	maxU: number;
	maxV: number;
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
};

const defaultLayout: RTTSheet_ItemInfo = {
	uniqueID: -1,
	ID: 'default',
	pixiRect: new PIXI.Rectangle(0, 0, 1, 1),
	pixiMask: new PIXI.Graphics(),
	minU: 0,
	minV: 0,
	maxU: 1,
	maxV: 1,
	minX: 0,
	maxX: 1,
	minY: 0,
	maxY: 1,
};

//NB Change this to an array of slots with IDs, allowing the IDs to become dynamic and marked as used/unused

export class RTTSheet {
	protected static nextUID: number = 0;

	protected activePool: RTTSheet_ItemInfo[] = [];
	protected assignablePool: RTTSheet_ItemInfo[] = [];

	protected ID: string;
	protected sheetWidth: number;
	protected sheetHeight: number;
	protected renderTexture: PIXI.RenderTexture;

	constructor(ID: string, width: number, height: number) {
		this.ID = ID;
		this.sheetWidth = width;
		this.sheetHeight = height;
		this.renderTexture = PIXI.RenderTexture.create({
			width: this.sheetWidth,
			height: this.sheetHeight,
		});
	}

	//Add data

	public AddItemInfo_Active(
		ID: string,
		x: number,
		y: number,
		width: number,
		height: number,
	) {
		this.internal_AddItemInfo(true, ID, x, y, width, height);
	}

	public AddItemInfo_Assignable(
		ID: string,
		x: number,
		y: number,
		width: number,
		height: number,
	) {
		this.internal_AddItemInfo(false, ID, x, y, width, height);
	}

	protected internal_AddItemInfo(
		active: boolean,
		ID: string,
		x: number,
		y: number,
		width: number,
		height: number,
	) {
		//Create the new entry

		const maxX: number = x + width - 1;
		const maxY: number = y + height - 1;

		const pixiMask = new PIXI.Graphics();
		pixiMask.beginFill(0xffffff);
		pixiMask.drawRect(x, y, width, height);
		pixiMask.endFill();

		const info: RTTSheet_ItemInfo = {
			ID: ID,
			uniqueID: RTTSheet.nextUID++,
			pixiRect: new PIXI.Rectangle(x, y, width, height),
			pixiMask: pixiMask,
			minU: x / this.sheetWidth,
			minV: y / this.sheetHeight,
			maxU: maxX / this.sheetWidth,
			maxV: maxY / this.sheetHeight,
			minX: x,
			minY: y,
			maxX: maxX,
			maxY: maxY,
		};

		if (active) {
			this.activePool.push(info);
		} else {
			this.assignablePool.push(info);
		}
	}

	public GetID(): string {
		return this.ID;
	}

	public GetItemInfoByID(ID: string): RTTSheet_ItemInfo {
		const info: RTTSheet_ItemInfo = this.activePool.find((existing) => {
			return existing.ID === ID;
		});
		if (info === undefined) {
			return defaultLayout;
		}

		return info;
	}

	public GetItemInfoByUID(uniqueID: number): RTTSheet_ItemInfo {
		const info: RTTSheet_ItemInfo = this.activePool.find((existing) => {
			return existing.uniqueID === uniqueID;
		});
		if (info === undefined) {
			return defaultLayout;
		}

		return info;
	}

	public GetTexture(): PIXI.RenderTexture {
		return this.renderTexture;
	}
}
