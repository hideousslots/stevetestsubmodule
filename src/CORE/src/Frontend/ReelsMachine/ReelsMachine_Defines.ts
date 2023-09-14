/**
 * ReelMachine_Defines.ts
 *
 * Defines for the reel machine shared between parts
 */

import { SlotMachine_Config } from '../../System/SlotMachineHandling/SlotMachine_Config';
import { RTTSheet } from '../../System/RenderToTextureHandling/RTTSheet';
import { ReelsMachine_CellSymbolMatchup } from './ReelsMachine_CellSymbolMatchup';
import * as PIXI from 'pixi.js';

export type ReelsMachine_VisualControl = {
	symbolsPerSecondFullSpeed: number;
	rampUpTime: number;
	pullbackTime: number;
	pullbackDistance: number;
};

export type ReelsMachine_Config = {
	slotMachineConfig: SlotMachine_Config;
	symbolSheet: RTTSheet;
	symbolMatchup: ReelsMachine_CellSymbolMatchup;
	initialGrid: number[][];
	cellWidth: number;
	cellHeight: number;
	rowGap: number;
	columnGap: number;
	visualControl: ReelsMachine_VisualControl;
};
