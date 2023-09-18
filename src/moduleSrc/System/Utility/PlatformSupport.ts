/**
 * PlatformSupport.ts
 *
 * Class to test and record platform support functions
 */

import { BUILDTARGETOPTIONS } from './BuildTargetOptions';

export class PlatformSupport {
	//Public flags for support

	public available_webp: boolean = false;
	public available_debug: boolean = false;

	//Code handling support and access functions

	constructor() {
		//Run support tests

		this.Test_Webp().then((webpSupport) => {
			this.available_webp = webpSupport;
		});

		//Debug available?

		if (
			BUILDTARGETOPTIONS.IsSet('debugavailable') &&
			this.CheckURLParameterExists('debug')
		) {
			this.available_debug = true;
		}
	}

	//URL Parameter access

	public GetURLParameterValue(parameterName: string): string | undefined {
		const currentURL = new URL(window.location.href);
		let returnValue: string | undefined = undefined;
		currentURL.searchParams.forEach((value, key) => {
			if (key === parameterName) {
				returnValue = value;
			}
		});
		return returnValue;
	}

	public CheckURLParameterExists(parameterName: string): boolean {
		const currentURL = new URL(window.location.href);
		let returnValue: boolean = false;
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

	protected async Test_Webp(): Promise<boolean> {
		const testImages = {
			lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
			lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
			alpha: 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
		};

		if (!(await this.checkWebpFeature(testImages['lossy']))) {
			return false;
		}

		if (!(await this.checkWebpFeature(testImages['lossless']))) {
			return false;
		}

		if (!(await this.checkWebpFeature(testImages['alpha']))) {
			return false;
		}

		return true;
	}

	private async checkWebpFeature(testItem: string): Promise<boolean> {
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
	}
}
