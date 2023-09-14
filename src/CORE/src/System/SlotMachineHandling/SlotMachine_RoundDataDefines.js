/**
 * SlotMachine_RoundDataDefines.ts
 *
 * Structures and defines for slot machines that will be shared
 */
export class SlotMachine_FeatureData_Base {
}
export class SlotMachine_WinLine {
}
export class SlotMachine_SpinData_State {
}
export class SlotMachine_SpinData {
}
export class SlotMachine_RoundData {
    constructor(serverData) {
        this.roundID = 'none';
        this.playType = 'none';
        this.playStake = 0;
        this.coinCount = 0;
        this.coinValue = 0;
        this.startBalance = 0;
        this.endBalance = 0;
        this.spinData = [];
    }
}
//# sourceMappingURL=SlotMachine_RoundDataDefines.js.map