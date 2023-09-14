/**
 * SlotMachine.ts
 *
 * Logical slot machine embedded in CORE
 */
import { SlotMachine_RoundData } from './SlotMachine_RoundDataDefines';
export class SlotMachine {
    constructor(config) {
        this.config = config;
        //Current data
        this.balance = 0;
        this.currentRoundData = new SlotMachine_RoundData({});
    }
    //Public interface code
    GetID() {
        return this.config.ID;
    }
    GetBalance() {
        return this.balance;
    }
    GetRoundData() {
        return this.currentRoundData;
    }
    GetConfig() {
        return this.config;
    }
}
//# sourceMappingURL=SlotMachine.js.map