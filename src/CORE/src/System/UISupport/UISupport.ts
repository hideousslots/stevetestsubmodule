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

/**
 * UIButtonPress_Callback
 *
 * Pass in the ID of the button pressed, the callback returns TRUE if handled
 */
class UIButtonPress_Callback {
	constructor(
		public ID: string,
		public callback: (buttonID: string) => boolean,
	) {}
}

export class UISupport {
	// protected _UIButtonSignal: Signal<(buttonID: string) => void> = new Signal<
	// 	(buttonID: string) => void
	// >();

	// get UIButtonSignal() {
	// 	return this._UIButtonSignal;
	// }

	protected callbacks: UIButtonPress_Callback[] = [];
	protected buttonsPressed: string[] = [];

	constructor(protected uiContainer: PIXISystemUIContainer) {}

	public SetStyle(style: PIXISYSTEMUI_STYLE) {
		this.uiContainer.SetStyle(style);
	}

	public GetAnchor(id: PIXISYSTEMUI_ANCHORID): PIXI.Container {
		return this.uiContainer.GetAnchor(id);
	}

	//UIButton handling

	public UIButtonPressed(buttonID: string) {
		this.buttonsPressed.push(buttonID);
	}

	/**
	 * UIButtonPassDown
	 *
	 * Pass all button presses down to callbacks.
	 * This is called from the engine to ensure button presses are responded to at a known point (during heartbeat tick, prior to state updates)
	 */

	public UIButtonPassDownFromEngine() {
		//For each button press, pass down through callbacks

		this.buttonsPressed.forEach((buttonID) => {
			//Pass to each callback, abort passdown if it is reported

			for (let i = 0; i < this.callbacks.length; i++) {
				if (this.callbacks[i].callback(buttonID)) {
					//Handled, abort

					break;
				}
			}
		});

		//Clear button press stack

		this.buttonsPressed = [];
	}

	//UIButton callback handling

	public AddButtonCallback(
		callback: (buttonID: string) => boolean,
		ID: string,
	) {
		if (
			this.callbacks.findIndex((existing) => {
				return existing.callback === callback;
			}) === -1
		) {
			this.callbacks.push(new UIButtonPress_Callback(ID, callback));
		}
	}

	public RemoveButtonCallback(callback: (buttonID: string) => boolean) {
		let index;
		if (
			(index = this.callbacks.findIndex((existing) => {
				return existing.callback === callback;
			})) !== -1
		) {
			this.callbacks.splice(index, 1);
		}
	}
}
