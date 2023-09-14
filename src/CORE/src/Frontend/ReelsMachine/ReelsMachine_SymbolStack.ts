/**
 * ReelsMachine_SymbolStack
 *
 * Code to handle the stack of symbols in the current reel
 *
 * The stack is a cyclic buffer, so moves to 0 point for efficiency of filling.
 *
 * Conceptually it looks like this (for a 6 cell reel):
 *
 * STACK:
 * [0] - on top of the reel machine, about to enter cell 0
 * [1] - in view in cell 0
 * [2] - in view in cell 1
 * [3] - in view in cell 2
 * [4] - in view in cell 3
 * [5] - in view in cell 4
 * [6] - in view in cell 5
 * [7] - underneath reel machine, will enter cell 6 on rollback
 *
 * LANDEDSTACK:
 * [0] - value for cell 0 when landed
 * [1] - value for cell 1 when landed
 * [2] - value for cell 2 when landed
 * [3] - value for cell 3 when landed
 * [4] - value for cell 4 when landed
 * [5] - value for cell 5 when landed
 *
 * The data in the stack consist of:
 * {
 * symbolIndex: Value pass in when setting it
 * symbolInfo: ReelsMachine_CellSymbolMatchup_Info - consist of the index of the symbol, its name, its UV data for cell drawing
 * other info to be added as needed (such as container or object for extra symbol graphics?)
 * }
 */

import { ReelsMachine } from './ReelsMachine';
import { ReelsMachine_Cell } from './ReelsMachine_Cell';

import { RTTSheet } from '../../System/RenderToTextureHandling/RTTSheet';
import {
	ReelsMachine_CellSymbolMatchup_Info,
	ReelsMachine_CellSymbolMatchup,
} from './ReelsMachine_CellSymbolMatchup';

export type ReelsMachine_SymbolStack_Entry = {
	symbolIndex: number;
	symbolInfo: ReelsMachine_CellSymbolMatchup_Info;
};

export class ReelsMachine_SymbolStack {
	//Static data

	protected static symbolSheet: RTTSheet;
	protected static symbolMatchup: ReelsMachine_CellSymbolMatchup;

	public static SetSymbolInfo(
		symbolSheet: RTTSheet,
		symbolMatchup: ReelsMachine_CellSymbolMatchup,
	) {
		ReelsMachine_SymbolStack.symbolSheet = symbolSheet;
		ReelsMachine_SymbolStack.symbolMatchup = symbolMatchup;
	}

	//Instance data

	protected stack: ReelsMachine_SymbolStack_Entry[] = [];
	protected landedStack: ReelsMachine_SymbolStack_Entry[] = [];
	protected landedStackReadIndex: number = 0;

	protected currentTopIndex: number = 0;

	constructor(initialStack: number[]) {
		//Build the rolling stack

		for (let i = 0; i < initialStack.length; i++) {
			const symbolIndex: number = initialStack[i];
			const data: ReelsMachine_SymbolStack_Entry = {
				symbolIndex: symbolIndex,
				symbolInfo:
					ReelsMachine_SymbolStack.symbolMatchup.GetData(symbolIndex),
			};
			this.stack.push(data);
		}

		//Set initial landed stack to all with a matching number of symbols as the initial stack. Any filling will be done from index 1!

		for (let i = 0; i < initialStack.length; i++) {
			const symbolIndex: number = 0;
			const data: ReelsMachine_SymbolStack_Entry = {
				symbolIndex: symbolIndex,
				symbolInfo:
					ReelsMachine_SymbolStack.symbolMatchup.GetData(symbolIndex),
			};
			this.landedStack.push(data);
		}
		this.landedStackReadIndex = this.landedStack.length - 1;
	}

	/**
	 * MoveStack
	 *
	 * @param offset - specify the move direction
	 * @param useLandedCells - pull fill from landed cells into the stack rather than randoms
	 * @returns - if all landed cells have been pulled
	 */
	public MoveStack(offset: number, useLandedCells: boolean): boolean {
		let fullyLanded: boolean = false;
		//Move up/down filling the stack en route

		if (offset === 0) {
			return false;
		}

		const delta: number = offset > 0 ? -1 : 1;

		//Limit movement to one cell for now (may keep this!)

		offset = 1;

		//Move the top

		this.currentTopIndex =
			(this.currentTopIndex + delta + this.stack.length) %
			this.stack.length;

		//Fill as needed. NB If fully landed, abort

		const currentFill =
			(this.currentTopIndex + this.stack.length - 1) % this.stack.length;
		if (useLandedCells) {
			//handle the wrap around to fully land the stack

			let readLandIndex = this.landedStackReadIndex--;
			if (readLandIndex < 0) {
				readLandIndex = this.landedStack.length - 1;
				fullyLanded = true;
			}

			//Take the next landed cell

			this.stack[currentFill].symbolIndex =
				this.landedStack[readLandIndex].symbolIndex;
			this.stack[currentFill].symbolInfo =
				this.landedStack[readLandIndex].symbolInfo;
		} else {
			//Pick a random to fill with

			const symbolIndex: number = Math.floor(Math.random() * 5);

			this.stack[currentFill].symbolIndex = symbolIndex;
			this.stack[currentFill].symbolInfo =
				ReelsMachine_SymbolStack.symbolMatchup.GetData(symbolIndex);
		}

		return fullyLanded;
	}

	public ReadStack(index: number): ReelsMachine_SymbolStack_Entry {
		return this.stack[(this.currentTopIndex + index) % this.stack.length];
	}

	public WriteStack(index: number, symbolIndex: number) {
		const writeIndex: number =
			(this.currentTopIndex + index) % this.stack.length;
		this.stack[writeIndex].symbolIndex = symbolIndex;
		this.stack[writeIndex].symbolInfo =
			ReelsMachine_SymbolStack.symbolMatchup.GetData(symbolIndex);
	}

	public SetLandedStack(symbols: number[]) {
		//Set the first and last landing stack values to a random

		this.landedStack[0].symbolIndex = 1;
		this.landedStack[0].symbolInfo =
			ReelsMachine_SymbolStack.symbolMatchup.GetData(1);

		this.landedStack[this.landedStack.length - 1].symbolIndex = 1;
		this.landedStack[this.landedStack.length - 1].symbolInfo =
			ReelsMachine_SymbolStack.symbolMatchup.GetData(1);

		//Fill in the landed stack passed from index 1

		for (let i = 1; i < this.landedStack.length - 1; i++) {
			let symbolIndex: number = symbols[i - 1];
			if (symbolIndex === undefined) {
				symbolIndex = 0;
			}
			this.landedStack[i].symbolIndex = symbolIndex;
			this.landedStack[i].symbolInfo =
				ReelsMachine_SymbolStack.symbolMatchup.GetData(symbolIndex);
		}

		this.landedStackReadIndex = this.landedStack.length - 1;
	}
}
