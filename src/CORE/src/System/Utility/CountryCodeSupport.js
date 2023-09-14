/**
 * CountryCodeSupport.ts
 *
 * Support code to help identify the 2letter country code language file needed
 */
export class CountryCodeSupport {
    get codeInUse() {
        return this._codeinuse;
    }
    //Might be able to do something useful in contructor
    constructor() {
        this._codeinuse = 'en'; //Default to en
    }
    Reassess() {
        //Handle the reassessment as needed
        //eg URL param or system settings
    }
}
//# sourceMappingURL=CountryCodeSupport.js.map