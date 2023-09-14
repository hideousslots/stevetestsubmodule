/**
 * UISupport.ts
 *
 * Support for the system's UI container
 */
import { Signal } from 'typed-signals';
export class UISupport {
    get UIButtonSignal() {
        return this._UIButtonSignal;
    }
    constructor(uiContainer) {
        this.uiContainer = uiContainer;
        this._UIButtonSignal = new Signal();
    }
    SetStyle(style) {
        this.uiContainer.SetStyle(style);
    }
    GetAnchor(id) {
        return this.uiContainer.GetAnchor(id);
    }
}
//# sourceMappingURL=UISupport.js.map