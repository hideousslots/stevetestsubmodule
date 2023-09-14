/**
 * BuildTargetOptions.ts
 *
 * Handling of config for buildtarget configs
 */
export class BuildTargetOptions {
    constructor(newConfig) {
        if (BUILDTARGETOPTIONS !== undefined) {
            return;
        }
        BUILDTARGETOPTIONS = this;
        this.config = newConfig;
    }
    DebugShowConfig() {
        return JSON.stringify(this.config);
    }
    IsSet(id) {
        if (this.config[id] === undefined) {
            return false;
        }
        return this.config[id];
    }
    GetString(id) {
        if (this.config[id] === undefined) {
            console.log('BuildTarget ' + id + ' not set');
            return '';
        }
        return this.config[id];
    }
}
let BUILDTARGETOPTIONS;
export { BUILDTARGETOPTIONS };
//# sourceMappingURL=BuildTargetOptions.js.map