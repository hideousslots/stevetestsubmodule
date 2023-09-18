/**
 * StateMachine.ts
 *
 * The state handling class
 */

import { HEARTBEAT } from '../Engine';
import { StateBase } from './StateBase';

export class StateMachine {
	protected currentStateID: string = '';
	protected nextStateID: string = '';
	protected currentState: StateBase = undefined;
	protected availableStates: StateBase[] = [];

	public thisStateStartTime: number = 0;
	public thisStateRunningTime: number = 0;
	public lastTick: number = 0;

	constructor() {}

	public AddState(state: StateBase) {
		//Add the state to the lists

		state.Init();
		this.availableStates.push(state);
	}

	public RemoveState(stateID: string) {
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

	public SetNextState(ID: string) {
		this.nextStateID = ID;
	}

	public GetState(): string {
		return this.currentStateID;
	}

	public Tick() {
		if (this.lastTick === 0) {
			this.lastTick = HEARTBEAT.timeNow;
		}

		//Are we switching state?

		if (this.currentStateID !== this.nextStateID) {
			//Yes, close down the current state

			if (this.currentState !== undefined) {
				console.log(
					'STATEHANDLER: exiting ' + this.currentState.ID + ' state',
				);
				this.currentState.Stop();
			}

			//Start the new state

			this.thisStateStartTime = HEARTBEAT.timeNow;

			this.currentStateID = this.nextStateID;

			this.currentState = this.availableStates.find((existing) => {
				return existing.ID === this.currentStateID;
			});
			if (this.currentState !== undefined) {
				console.log(
					'STATEHANDLER: starting ' + this.currentState.ID + ' state',
				);
				this.currentState.Start();
			}
		}

		//Tick the relevant state

		this.thisStateRunningTime = HEARTBEAT.timeNow - this.thisStateStartTime;

		if (this.currentState !== undefined) {
			this.currentState.Tick(
				this.thisStateStartTime,
				HEARTBEAT.timeNow - this.lastTick,
				HEARTBEAT.timeNow,
			);
		}

		this.lastTick = HEARTBEAT.timeNow;
	}
}
