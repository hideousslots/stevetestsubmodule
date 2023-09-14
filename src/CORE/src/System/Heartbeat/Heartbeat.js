/**
 * HeartBeat.ts
 *
 * The logic system core heartbeat
 *
 * This is the time control for the logic system. Ticked (currently) by Pixi's ticker, it is the thing which all game logic
 * should listen to for ticks and time
 */
class HeartBeat_Callback {
    constructor(ID, callback) {
        this.ID = ID;
        this.callback = callback;
    }
}
export class HeartBeat {
    get msDelta() {
        return this._msDelta;
    }
    get timeNow() {
        return this._now;
    }
    get totalBeats() {
        return this._totalBeats;
    }
    constructor(systemTicker) {
        //Add my ticker
        this.systemTicker = systemTicker;
        this.callbacks = [];
        //Running values to read
        this._msDelta = 0;
        this._now = 0;
        this._totalBeats = 0;
        this.systemTicker.add(this.Tick, this);
    }
    Add(callback, ID) {
        if (this.callbacks.findIndex((existing) => {
            return existing.callback === callback;
        }) === -1) {
            this.callbacks.push(new HeartBeat_Callback(ID, callback));
        }
    }
    Remove(callback) {
        let index;
        if ((index = this.callbacks.findIndex((existing) => {
            return existing.callback === callback;
        })) !== -1) {
            this.callbacks.splice(index, 1);
        }
    }
    Tick(delta) {
        //Count beats
        this._totalBeats++;
        //Go through attached logic items and tick them
        //console.log('Heartbeat tick begins ');
        this._msDelta = this.systemTicker.elapsedMS;
        this._now = Date.now();
        this.callbacks.forEach((item) => {
            //Can trace order here
            //console.log('Heartbeat tick -> ' + item.ID);
            item.callback(this._msDelta, this._now);
        });
        //console.log('Heartbeat tick end ');
    }
    Debug_GetRunOrder() {
        //Report the list of ticks in order
        const order = [];
        this.callbacks.forEach((item, index) => {
            order.push('( ' + index + ' ) - ' + item.ID);
        });
        return order;
    }
}
//# sourceMappingURL=Heartbeat.js.map