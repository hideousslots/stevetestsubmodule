/**
 * SlotMachine_Config.ts
 *
 * Config class for setting up the logical slot machine.
 *
 * To be passed into engine setup
 */

import { SlotMachine_SpinData } from './SlotMachine_RoundDataDefines';

export abstract class SlotMachine_Config {
	constructor() {}

	public ID: string;
	public gridLayout: number[];
	public winLineData: number[][];

	//Decode functions to interpret data from server per game

	/**
	 * Decode_SingleSpin
	 *
	 * Decode a single spin's server response
	 *
	 */
	public Decode_SingleSpin(spinData: any): SlotMachine_SpinData | null {
		//Decode the single spin into the standard spindata structure for the engine

		//default class fails decode

		return null;
	}
}
