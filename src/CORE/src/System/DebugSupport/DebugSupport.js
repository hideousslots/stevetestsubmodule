/**
 * DebugSupport.ts
 *
 * Public debug class for application to use
 */
import { HEARTBEAT, PLATFORMSUPPORT } from '../Engine';
import { BUILDTARGETOPTIONS } from '../Utility/BuildTargetOptions';
export class DebugSupport {
    constructor(debugContainer) {
        this.debugContainer = debugContainer;
    }
    //Decide if debug is working based on both the buildtarget settings and the URL
    CheckIsDebug() {
        return (BUILDTARGETOPTIONS.IsSet('debugavailable') &&
            PLATFORMSUPPORT.CheckURLParameterExists('debug'));
    }
    //Text
    SetText(index, text) {
        if (this.CheckIsDebug()) {
            this.debugContainer.SetDebugText(index, text);
        }
    }
    //Limit box
    AddLimitBox(settings) {
        if (!this.CheckIsDebug()) {
            return -1;
        }
        return this.debugContainer.AddDebugLimit(settings);
    }
    RemoveLimitBox(UID) {
        if (this.CheckIsDebug()) {
            this.debugContainer.RemoveDebugLimit(UID);
        }
    }
    //Get heartbeat tick list
    ReportHeartbeatList() {
        if (this.CheckIsDebug) {
            console.log('Heartbeat ticks: ');
            HEARTBEAT.Debug_GetRunOrder().forEach((item) => {
                console.log(item);
            });
        }
    }
}
//# sourceMappingURL=DebugSupport.js.map