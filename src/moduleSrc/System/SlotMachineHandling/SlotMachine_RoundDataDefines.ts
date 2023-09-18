/**
 * SlotMachine_RoundDataDefines.ts
 *
 * Structures and defines for slot machines that will be shared
 */

export class SlotMachine_FeatureData_Base {
	public featureID: string;
}

export class SlotMachine_WinLine {
	public winLineIndex: number;
	public gridPositions: number[];
	public winPerSymbol: number;
	public totalWin: number;
}

export class SlotMachine_SpinData_State {
	public subIndex: number;
	public symbolGrid: number[][];
	public winLines: SlotMachine_WinLine;
	public featureData: SlotMachine_FeatureData_Base;
	public totalWin: number;
}

export class SlotMachine_SpinData {
	public index: number;
	public states: SlotMachine_SpinData_State[];
}

export class SlotMachine_RoundData {
	public roundID: string = 'none';
	public playType: string = 'none';
	public playStake: number = 0;
	public coinCount: number = 0;
	public coinValue: number = 0;
	public startBalance: number = 0;
	public endBalance: number = 0;
	public spinData: SlotMachine_SpinData[] = [];

	constructor(serverData: any) {}
}
