/**
 * UIButtonTest.ts
 *
 * Simple pixi button sending a message
 *
 */

import * as PIXI from 'pixi.js';
import { UISUPPORT } from '../Engine';

export class UIButtonTest extends PIXI.Container {
	protected graphic: PIXI.Graphics;

	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		colour: number,
		protected ID: string,
	) {
		super();

		this.x = x;
		this.y = y;

		this.graphic = new PIXI.Graphics();
		// Rectangle
		this.graphic.beginFill(colour);
		this.graphic.drawRect(0, 0, width, height);
		this.graphic.endFill();

		this.addChild(this.graphic);

		//this.interactive = true;

		this.eventMode = 'dynamic';

		this.on('pointertap', this.HandleClick, this);
	}

	protected HandleClick = () => {
		UISUPPORT.UIButtonSignal.emit(this.ID);
	};
}
