/**
 * EasingSupport.ts
 *
 * Support library for easing
 *
 * All calls take one or three calls:
 *
 * If one, it expects the time between 0 and 1
 *
 * If three, it calculates the time between 0 and 1 from start time, current time, and duration
 */

export class EasingSupport {
	protected CalculateTime(start: number, now: number, duration: number) {
		return (now - start) / duration;
	}

	public InSine(time: number, timeNow?: number, duration?: number) {
		if (timeNow !== undefined && duration !== undefined) {
			time = this.CalculateTime(time, timeNow, duration);
		}

		if (time < 0) {
			time = 0;
		} else if (time > 1) {
			time = 1;
		}

		return 1 - Math.cos((time * Math.PI) / 2);
	}

	public Linear(time: number, timeNow?: number, duration?: number) {
		if (timeNow !== undefined && duration !== undefined) {
			time = this.CalculateTime(time, timeNow, duration);
		}

		if (time < 0) {
			time = 0;
		} else if (time > 1) {
			time = 1;
		}

		return time;
	}
}
