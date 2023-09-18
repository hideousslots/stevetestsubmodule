/**
 * StateBase.ts
 *
 * Base class for a state for the state machine
 */
export class StateBase {
	public readonly ID: string = 'baseclass-setnamecorrectly!';

	/**
	 * Init
	 *
	 * Different from StartState, this is called ONCE when the state is added to the state machine handling
	 */

	public Init() {}

	/**
	 * Destroy
	 *
	 * Different from StopState, this is called ONCE when the state is removed from the state machine handling
	 */

	public Destroy() {}

	/**
	 * Start
	 *
	 * Called whenever the start is switch to
	 */

	public Start() {}

	/**
	 * Stop
	 *
	 * Called whenever the state is stopped
	 */

	public Stop() {}

	/**
	 * Tick
	 *
	 * Called once per frame that the state is running
	 *
	 * @param startTime - the time this start started according to the manager
	 * @param deltaTime - time in milliseconds second previous tick
	 * @param currentTime - the current time (from Date.now... ideally use this rather than date.now for synchronisation of time)
	 */

	public Tick(startTime: number, deltaTime: number, currentTime: number) {}
}
