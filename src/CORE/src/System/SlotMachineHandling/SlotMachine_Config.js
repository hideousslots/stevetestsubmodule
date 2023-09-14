/**
 * SlotMachine_Config.ts
 *
 * Config class for setting up the logical slot machine.
 *
 * To be passed into engine setup
 */
export class SlotMachine_Config {
    constructor() { }
    //Decode functions to interpret data from server per game
    /**
     * Decode_SingleSpin
     *
     * Decode a single spin's server response
     *
     */
    Decode_SingleSpin(spinData) {
        //Decode the single spin into the standard spindata structure for the engine
        //default class fails decode
        return null;
    }
}
//# sourceMappingURL=SlotMachine_Config.js.map