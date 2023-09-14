/**
 * UISupport.ts
 *
 * Support for the system's UI container
 */

import * as PIXI from 'pixi.js';

import {
	PIXISYSTEMUI_STYLE,
	PIXISYSTEMUI_ANCHORID,
	PIXISystemUIContainer,
} from '../PIXISystemClasses/PIXISystemUIContainer';

import { Signal } from 'typed-signals';

export class UISupport {
	protected _UIButtonSignal: Signal<(buttonID: string) => void> = new Signal<
		(buttonID: string) => void
	>();

	get UIButtonSignal() {
		return this._UIButtonSignal;
	}

	constructor(protected uiContainer: PIXISystemUIContainer) {}

	public SetStyle(style: PIXISYSTEMUI_STYLE) {
		this.uiContainer.SetStyle(style);
	}

	public GetAnchor(id: PIXISYSTEMUI_ANCHORID): PIXI.Container {
		return this.uiContainer.GetAnchor(id);
	}
}
