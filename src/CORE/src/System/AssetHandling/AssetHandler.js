/**
 * AssetHandler
 *
 * Handling class for assets
 */
import * as PIXI from 'pixi.js';
import * as WebFont from 'webfontloader';
import { COUNTRYCODESUPPORT, PLATFORMSUPPORT, SOUNDMANAGER, } from '../Engine';
//New setup using PIXI Asset Loader and keep track of data in own code
class AssetRecord {
    constructor(ref, src, alt, type) {
        this.loaded = false;
        this.loading = false;
        this.referenceName = ref;
        this.src = src;
        this.altExtension = alt;
        this.type = type;
    }
    CommenceLoad() {
        if (!this.loaded && !this.loading) {
            this.loading = true;
            //Validate the extension
            let correctedSrc = this.src;
            if (correctedSrc.substring(correctedSrc.length - 4) === 'webp') {
                if (!PLATFORMSUPPORT.available_webp) {
                    correctedSrc =
                        correctedSrc.substring(0, correctedSrc.length - 4) +
                            this.altExtension;
                }
            }
            //Correct mlt jsons?
            if (this.type === 'mlt') {
                //Check the language and load accordingly
                if (correctedSrc.substring(correctedSrc.length - 7) ===
                    'en.json') {
                    correctedSrc =
                        correctedSrc.substring(0, correctedSrc.length - 7) +
                            COUNTRYCODESUPPORT.codeInUse +
                            '.json';
                }
            }
            //Load the item
            if (correctedSrc.search('atlas') !== -1) {
                console.log('look');
            }
            PIXI.Assets.load(correctedSrc).then((data) => {
                this.loading = false;
                this.loaded = true;
                this.data = data;
                AssetRecord.onLoadCompleteCallback();
            });
        }
    }
}
export class AssetHandler {
    constructor() {
        //Pass all loader errors to common place in this class
        //this.loader.onError.add(this.onError);
        this.assetPool = [];
        this.loadedCount = 0;
        this.loadingCount = 0;
        this.onCompleteCallbacks = [];
        this.onProgressCallbacks = [];
        this.onAssetLoadComplete = () => {
            this.loadedCount++;
            this.loadingCount--;
            let progress = ((this.loadedCount - this.loadingCount) * 100) /
                this.assetPool.length;
            this.onProgressCallbacks.forEach((callback) => {
                callback(progress);
            });
            if (this.loadingCount === 0) {
                this.onCompleteCallbacks.forEach((callback) => {
                    callback();
                });
            }
        };
        AssetRecord.onLoadCompleteCallback = this.onAssetLoadComplete;
    }
    onError(error) {
        console.log('AssetLoader encountered error: ' + error);
    }
    SetCallBacks(onCompleteCallback, onProgressCallback) {
        if (onCompleteCallback !== undefined) {
            this.onCompleteCallbacks.push(onCompleteCallback);
        }
        if (onProgressCallback !== undefined) {
            this.onProgressCallbacks.push(onProgressCallback);
        }
    }
    ClearCallbacks() {
        this.onCompleteCallbacks = [];
        this.onProgressCallbacks = [];
    }
    AddLoadDataSingle(assetData) {
        this.assetPool.push(new AssetRecord(assetData.name, assetData.src, assetData.altExt ? assetData.altExt : '', assetData.type ? assetData.type : ''));
    }
    AddLoadData(assetData) {
        assetData.forEach((asset) => {
            this.AddLoadDataSingle(asset);
        });
    }
    AddLoadSpineData(assetData) {
        assetData.forEach((asset) => {
            this.assetPool.push(new AssetRecord(asset.name, asset.src, '', 'spinejson'));
        });
    }
    CommenceLoad() {
        this.assetPool.forEach((asset) => {
            if (!asset.loaded && !asset.loading) {
                this.loadingCount++;
                asset.CommenceLoad();
            }
        });
    }
    GetResource(resourceID) {
        const asset = this.assetPool.find((existing) => {
            return existing.referenceName === resourceID;
        });
        if (asset === undefined) {
            console.log('Attempt to access non loaded resource');
            return null;
        }
        return asset.data;
    }
    LoadWebFonts(families, URLs, callback) {
        WebFont.load({
            custom: {
                families: families,
                urls: URLs,
            },
            loading: () => { },
            inactive: () => { },
            active: () => {
                callback();
            },
        });
    }
    LoadAddRuntimeAssets(assetsConfigID) {
        const assetsConfig = this.GetResource(assetsConfigID);
        //Go through and add all runtine assets to the load list
        assetsConfig.sections.forEach((section) => {
            //Handle by type
            if (section.ID === 'PRELOAD') {
                //Skip
                return;
            }
            if (section.ID === 'SOUNDS') {
                //Load the sound assets
                if (section.assets !== undefined &&
                    section.assets.length !== 0) {
                    SOUNDMANAGER.LoadSoundItems(section.assets);
                }
            }
            if (section.ID === 'TEXTURES') {
                //Simple file load
                if (section.assets !== undefined &&
                    section.assets.length !== 0) {
                    this.AddLoadData(section.assets);
                }
            }
            if (section.ID === 'SPINES') {
                if (section.assets !== undefined &&
                    section.assets.length !== 0) {
                    this.AddLoadSpineData(section.assets);
                }
            }
        });
    }
}
//# sourceMappingURL=AssetHandler.js.map