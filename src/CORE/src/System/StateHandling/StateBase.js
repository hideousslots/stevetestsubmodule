/**
 * StateBase.ts
 *
 * Base class for a state for the state machine
 */
export class StateBase {
    constructor() {
        this.ID = 'baseclass-setnamecorrectly!';
    }
    /**
     * Init
     *
     * Different from StartState, this is called ONCE when the state is added to the state machine handling
     */
    Init() { }
    /**
     * Destroy
     *
     * Different from StopState, this is called ONCE when the state is removed from the state machine handling
     */
    Destroy() { }
    /**
     * Start
     *
     * Called whenever the start is switch to
     */
    Start() { }
    /**
     * Stop
     *
     * Called whenever the state is stopped
     */
    Stop() { }
    /**
     * Tick
     *
     * Called once per frame that the state is running
     *
     * @param startTime - the time this start started according to the manager
     * @param deltaTime - time in milliseconds second previous tick
     * @param currentTime - the current time (from Date.now... ideally use this rather than date.now for synchronisation of time)
     */
    Tick(startTime, deltaTime, currentTime) { }
}
//# sourceMappingURL=StateBase.js.map