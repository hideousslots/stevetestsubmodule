/**
 * HeartBeat.ts
 *
 * The logic system core heartbeat
 *
 * This is the time control for the logic system. Ticked (currently) by Pixi's ticker, it is the thing which all game logic
 * should listen to for ticks and time
 */

import * as PIXI from 'pixi.js';

class HeartBeat_Callback {
	constructor(
		public ID: string,
		public callback: (delta: number, now: number) => void,
	) {}
}

export class HeartBeat {
	protected callbacks: HeartBeat_Callback[] = [];

	//Running values to read

	protected _msDelta: number = 0;
	protected _now: number = 0;
	protected _totalBeats: number = 0;

	get msDelta(): number {
		return this._msDelta;
	}

	get timeNow(): number {
		return this._now;
	}

	get totalBeats(): number {
		return this._totalBeats;
	}

	constructor(protected systemTicker: PIXI.Ticker) {
		//Add my ticker

		this.systemTicker.add(this.Tick, this);
	}

	public Add(callback: (delta: number, now: number) => void, ID: string) {
		if (
			this.callbacks.findIndex((existing) => {
				return existing.callback === callback;
			}) === -1
		) {
			this.callbacks.push(new HeartBeat_Callback(ID, callback));
		}
	}

	public Remove(callback: (delta: number, now: number) => void) {
		let index;
		if (
			(index = this.callbacks.findIndex((existing) => {
				return existing.callback === callback;
			})) !== -1
		) {
			this.callbacks.splice(index, 1);
		}
	}

	protected Tick(delta: number) {
		//Count beats

		this._totalBeats++;

		//Go through attached logic items and tick them

		//console.log('Heartbeat tick begins ');

		this._msDelta = this.systemTicker.elapsedMS;
		this._now = Date.now();

		this.callbacks.forEach((item) => {
			//Can trace order here

			//console.log('Heartbeat tick -> ' + item.ID);
			item.callback(this._msDelta, this._now);
		});

		//console.log('Heartbeat tick end ');
	}

	public Debug_GetRunOrder(): string[] {
		//Report the list of ticks in order

		const order: string[] = [];
		this.callbacks.forEach((item, index) => {
			order.push('( ' + index + ' ) - ' + item.ID);
		});

		return order;
	}
}
