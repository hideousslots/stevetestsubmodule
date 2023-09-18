//Export under CORE

export * as CORE from './moduleSrc/exports';

//Some separate exports for convenience

export { LOGGER } from './moduleSrc/exports';
export { PIXI } from './moduleSrc/exports';
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
} from './moduleSrc/exports';

//Separate module simple test

console.log('Engine2 submodule "Engine2" installed as CORE@CORE');
