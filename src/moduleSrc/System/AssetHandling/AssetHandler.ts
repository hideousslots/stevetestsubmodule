/**
 * AssetHandler
 *
 * Handling class for assets
 */

import * as PIXI from 'pixi.js';
import * as WebFont from 'webfontloader';
import {
	ASSETHANDLER,
	COUNTRYCODESUPPORT,
	PLATFORMSUPPORT,
	SOUNDMANAGER,
} from '../Engine';

//New setup using PIXI Asset Loader and keep track of data in own code

class AssetRecord {
	public static onLoadCompleteCallback: () => void;

	public data: any;
	public loaded: boolean = false;
	public loading: boolean = false;
	public referenceName: string;
	public src: string;
	public altExtension: string;
	public type: string;

	constructor(ref: string, src: string, alt: string, type: string) {
		this.referenceName = ref;
		this.src = src;
		this.altExtension = alt;
		this.type = type;
	}

	public CommenceLoad() {
		if (!this.loaded && !this.loading) {
			this.loading = true;

			//Validate the extension

			let correctedSrc: string = this.src;
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
				if (
					correctedSrc.substring(correctedSrc.length - 7) ===
					'en.json'
				) {
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
	protected assetPool: AssetRecord[] = [];
	protected loadedCount: number = 0;
	protected loadingCount: number = 0;

	//	protected loader: PIXI.Loader = PIXI.Loader.shared;
	protected webfontCallback: () => void;
	protected onCompleteCallbacks: (() => void)[] = [];
	protected onProgressCallbacks: ((value: number) => void)[] = [];

	constructor() {
		//Pass all loader errors to common place in this class
		//this.loader.onError.add(this.onError);

		AssetRecord.onLoadCompleteCallback = this.onAssetLoadComplete;
	}

	protected onError(error: any) {
		console.log('AssetLoader encountered error: ' + error);
	}

	protected onAssetLoadComplete = () => {
		this.loadedCount++;
		this.loadingCount--;
		let progress =
			((this.loadedCount - this.loadingCount) * 100) /
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

	public SetCallBacks(
		onCompleteCallback: () => void,
		onProgressCallback: (value: number) => void,
	) {
		if (onCompleteCallback !== undefined) {
			this.onCompleteCallbacks.push(onCompleteCallback);
		}
		if (onProgressCallback !== undefined) {
			this.onProgressCallbacks.push(onProgressCallback);
		}
	}

	public ClearCallbacks() {
		this.onCompleteCallbacks = [];
		this.onProgressCallbacks = [];
	}

	public AddLoadDataSingle(assetData: any) {
		this.assetPool.push(
			new AssetRecord(
				assetData.name,
				assetData.src,
				assetData.altExt ? assetData.altExt : '',
				assetData.type ? assetData.type : '',
			),
		);
	}

	public AddLoadData(assetData: any[]) {
		assetData.forEach((asset) => {
			this.AddLoadDataSingle(asset);
		});
	}

	public CommenceLoad() {
		this.assetPool.forEach((asset) => {
			if (!asset.loaded && !asset.loading) {
				this.loadingCount++;
				asset.CommenceLoad();
			}
		});
	}

	public GetResource(resourceID: string): any {
		const asset: AssetRecord = this.assetPool.find((existing) => {
			return existing.referenceName === resourceID;
		});
		if (asset === undefined) {
			console.log('Attempt to access non loaded resource');
			return null;
		}
		return asset.data;
	}

	public LoadWebFonts(families: string[], URLs: string[], callback: any) {
		WebFont.load({
			custom: {
				families: families,
				urls: URLs,
			},
			loading: () => {},
			inactive: () => {},
			active: () => {
				callback();
			},
		});
	}

	public LoadAddRuntimeAssets(assetsConfigID: string) {
		const assetsConfig: any = this.GetResource(assetsConfigID);
		//Go through and add all runtine assets to the load list
		assetsConfig.sections.forEach((section: any) => {
			//Handle by type
			if (section.ID === 'PRELOAD') {
				//Skip
				return;
			}
			if (section.ID === 'SOUNDS') {
				//Load the sound assets
				if (
					section.assets !== undefined &&
					section.assets.length !== 0
				) {
					SOUNDMANAGER.LoadSoundItems(section.assets);
				}
			}
			if (section.ID === 'RUNTIME') {
				//Simple file load
				if (
					section.assets !== undefined &&
					section.assets.length !== 0
				) {
					this.AddLoadData(section.assets);
				}
			}
		});
	}
}
