/**
 * SymbolBase.ts
 *
 * Base symbol class
 *
 * Very simple symbol class that can do basic things like set the spine/sprite
 */

import * as PIXI from 'pixi.js';

import { PIXIContainerBase } from './PIXIContainerBase';

export class SymbolBase extends PIXIContainerBase {
	protected sprite: PIXI.Sprite;

	//For now, just create a coloured circle

	constructor(width: number, height: number) {
		super();
		this.sprite = new PIXI.Sprite(undefined);
	}
}
