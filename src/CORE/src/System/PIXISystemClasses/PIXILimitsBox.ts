/**
 * PIXILimitsBox.ts
 *
 * Simple class to draw a box and cross around bounds for debug
 */

import * as PIXI from 'pixi.js';

export interface PIXILimitsBoxConfig {
	UID: number;
	centerX: number;
	centerY: number;
	width: number;
	height: number;
	colour?: number;
	lineWidth?: number;
	alpha?: number;
}

export class PIXILimitsBox extends PIXI.Container {
	protected graphics: PIXI.Graphics;
	public UID: number;

	constructor(config: PIXILimitsBoxConfig) {
		super();

		this.UID = config.UID;
		const centerX = config.centerX;
		const centerY = config.centerY;
		const width = config.width;
		const height = config.height;
		const colour = config.colour !== undefined ? config.colour : 0xff00ff;
		const lineWidth = config.lineWidth !== undefined ? config.lineWidth : 5;

		this.alpha = config.alpha !== undefined ? config.alpha : 1;

		const left: number = centerX - width / 2;
		const top: number = centerY - height / 2;
		const bot: number = top + height;
		const right: number = left + width;

		this.graphics = new PIXI.Graphics();
		this.graphics.lineStyle(lineWidth, colour);
		this.graphics.drawRect(left, top, width, height);
		this.graphics.moveTo(left, top);
		this.graphics.lineTo(right, bot);
		this.graphics.moveTo(left, bot);
		this.graphics.lineTo(right, top);
		this.graphics.drawCircle(centerX, centerY, lineWidth);
		this.addChild(this.graphics);
	}
}
