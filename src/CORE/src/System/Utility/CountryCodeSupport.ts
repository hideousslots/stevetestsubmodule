/**
 * CountryCodeSupport.ts
 *
 * Support code to help identify the 2letter country code language file needed
 */

export class CountryCodeSupport {
	protected _codeinuse: string = 'en'; //Default to en
	get codeInUse() {
		return this._codeinuse;
	}

	//Might be able to do something useful in contructor

	constructor() {}

	public Reassess() {
		//Handle the reassessment as needed
		//eg URL param or system settings
	}
}
