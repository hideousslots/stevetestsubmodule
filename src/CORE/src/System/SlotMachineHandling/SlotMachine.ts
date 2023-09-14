/**
 * SlotMachine.ts
 *
 * Logical slot machine embedded in CORE
 */

import { SlotMachine_Config } from './SlotMachine_Config';
import { SlotMachine_RoundData } from './SlotMachine_RoundDataDefines';

export class SlotMachine {
	//Current data

	protected balance: number = 0;

	protected currentRoundData: SlotMachine_RoundData =
		new SlotMachine_RoundData({});

	constructor(protected config: SlotMachine_Config) {}

	//Public interface code

	public GetID(): string {
		return this.config.ID;
	}

	public GetBalance(): number {
		return this.balance;
	}

	public GetRoundData(): SlotMachine_RoundData {
		return this.currentRoundData;
	}

	public GetConfig(): SlotMachine_Config {
		return this.config;
	}
}
