//Export under CORE

export * as CORE from './src/exports';

//Some separate exports for convenience

export { LOGGER } from './src/exports';
export { PIXI } from './src/exports';
export {
	Debug_LimitParams,
	EngineParameters,
	Screen_LayoutData,
	Screen_Orientation,
	SlotMachine_Config,
	SlotMachine_FeatureData_Base,
	SlotMachine_WinLine,
	SlotMachine_SpinData,
	SlotMachine_SpinData_State,
	SlotMachine_RoundData,
} from './src/exports';

//Separate module simple test

console.log('Engine2 core installed');
