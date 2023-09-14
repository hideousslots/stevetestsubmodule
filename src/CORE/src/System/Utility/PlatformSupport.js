/**
 * PlatformSupport.ts
 *
 * Class to test and record platform support functions
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
import { BUILDTARGETOPTIONS } from './BuildTargetOptions';
export class PlatformSupport {
    //Code handling support and access functions
    constructor() {
        //Run support tests
        //Public flags for support
        this.available_webp = false;
        this.available_debug = false;
        this.Test_Webp().then((webpSupport) => {
            this.available_webp = webpSupport;
        });
        //Debug available?
        if (BUILDTARGETOPTIONS.IsSet('debugavailable') &&
            this.CheckURLParameterExists('debug')) {
            this.available_debug = true;
        }
    }
    //URL Parameter access
    GetURLParameterValue(parameterName) {
        const currentURL = new URL(window.location.href);
        let returnValue = undefined;
        currentURL.searchParams.forEach((value, key) => {
            if (key === parameterName) {
                returnValue = value;
            }
        });
        return returnValue;
    }
    CheckURLParameterExists(parameterName) {
        const currentURL = new URL(window.location.href);
        let returnValue = false;
        currentURL.searchParams.forEach((value, key) => {
            if (key === parameterName) {
                returnValue = true;
            }
        });
        return returnValue;
    }
    //WebP support
    //Code lightly borrowed from standard tests found on the internet
    //azl397985856/check_webp_feature.js
    //Modified for early abort
    Test_Webp() {
        return __awaiter(this, void 0, void 0, function* () {
            const testImages = {
                lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
                lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
                alpha: 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
            };
            if (!(yield this.checkWebpFeature(testImages['lossy']))) {
                return false;
            }
            if (!(yield this.checkWebpFeature(testImages['lossless']))) {
                return false;
            }
            if (!(yield this.checkWebpFeature(testImages['alpha']))) {
                return false;
            }
            return true;
        });
    }
    checkWebpFeature(testItem) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    const result = img.width > 0 && img.height > 0;
                    resolve(result);
                };
                img.onerror = () => {
                    resolve(false);
                };
                img.src = 'data:image/webp;base64,' + testItem;
            });
        });
    }
}
//# sourceMappingURL=PlatformSupport.js.map