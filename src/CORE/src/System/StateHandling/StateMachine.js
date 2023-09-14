/**
 * StateMachine.ts
 *
 * The state handling class
 */
import { HEARTBEAT } from '../Engine';
export class StateMachine {
    constructor() {
        this.currentStateID = '';
        this.nextStateID = '';
        this.currentState = undefined;
        this.availableStates = [];
        this.thisStateStartTime = 0;
        this.thisStateRunningTime = 0;
        this.lastTick = 0;
    }
    AddState(state) {
        //Add the state to the lists
        state.Init();
        this.availableStates.push(state);
    }
    RemoveState(stateID) {
        const index = this.availableStates.findIndex((existing) => {
            return existing.ID === stateID;
        });
        if (index !== -1) {
            const state = this.availableStates[index];
            if (this.currentState.ID === stateID) {
                this.currentState.Stop();
                this.currentState = undefined;
            }
            state.Destroy();
            this.availableStates.splice(index, 1);
        }
    }
    SetNextState(ID) {
        this.nextStateID = ID;
    }
    GetState() {
        return this.currentStateID;
    }
    Tick() {
        if (this.lastTick === 0) {
            this.lastTick = HEARTBEAT.timeNow;
        }
        //Are we switching state?
        if (this.currentStateID !== this.nextStateID) {
            //Yes, close down the current state
            if (this.currentState !== undefined) {
                console.log('STATEHANDLER: exiting ' + this.currentState.ID + ' state');
                this.currentState.Stop();
            }
            //Start the new state
            this.thisStateStartTime = HEARTBEAT.timeNow;
            this.currentStateID = this.nextStateID;
            this.currentState = this.availableStates.find((existing) => {
                return existing.ID === this.currentStateID;
            });
            if (this.currentState !== undefined) {
                console.log('STATEHANDLER: starting ' + this.currentState.ID + ' state');
                this.currentState.Start();
            }
        }
        //Tick the relevant state
        this.thisStateRunningTime = HEARTBEAT.timeNow - this.thisStateStartTime;
        if (this.currentState !== undefined) {
            this.currentState.Tick(this.thisStateStartTime, HEARTBEAT.timeNow - this.lastTick, HEARTBEAT.timeNow);
        }
        this.lastTick = HEARTBEAT.timeNow;
    }
}
//# sourceMappingURL=StateMachine.js.map