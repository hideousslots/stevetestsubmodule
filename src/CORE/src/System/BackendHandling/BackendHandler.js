/**
 * BackendHandler.ts
 *
 * Code which issues and interfaces to the required backend system
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BUILDTARGETOPTIONS } from '../Utility/BuildTargetOptions';
import { TequityBackend_FakeLocal, TEQUITY_FAKELOCAL_CONFIG, } from './BackendsAvailable/Tequity/TequityBackend_FakeLocal';
//Available backends go here
const availableBackends = {};
export class BackendHandler {
    constructor() {
        this.loaded = false;
    }
    Init() {
        return __awaiter(this, void 0, void 0, function* () {
            //Determine which backend we should be using the URL and build configs
            let backendID = BUILDTARGETOPTIONS.GetString('backendID');
            //Can the ID be overridden by URL?
            if (BUILDTARGETOPTIONS.IsSet('canoverridebackendID')) {
                //Override with the backendid in the URL if present
                const currentURL = new URL(window.location.href);
                currentURL.searchParams.forEach((value, key) => {
                    if (key === 'backend') {
                        backendID = value;
                    }
                });
            }
            console.log('SNC BACKENDID CONFIRMED AS ' + backendID);
            //Find the correct API
            this.backend = new TequityBackend_FakeLocal();
            this.backend.Install(TEQUITY_FAKELOCAL_CONFIG);
        });
    }
}
//# sourceMappingURL=BackendHandler.js.map