import * as PIXI from 'pixi.js';

export enum Screen_Orientation {
	Landscape = 'landscape',
	Portrait = 'portrait',
}

export class Screen_LayoutData {
	public orientation: Screen_Orientation = Screen_Orientation.Landscape;

	//Device side

	public device_Width: number = 1;
	public device_Height: number = 1;
	public device_CenterX: number = 0;
	public device_CenterY: number = 0;

	//App side

	public width: number = 0;
	public height: number = 0;
	public centerX: number = 0;
	public centerY: number = 0;
	public offsetX: number = 0;
	public offsetY: number = 0;
	public scale: number = 0;
}

export class ScreenManager {
	protected pixelWidth: number;
	protected pixelHeight: number;
	protected boundaryWidth: number;
	protected boundaryHeight: number;
	protected gameScreenData: Screen_LayoutData;
	protected pixiApp: PIXI.Application;

	protected callbacks: ((data: Screen_LayoutData) => void)[] = [];

	constructor(
		app: PIXI.Application,
		pixelWidth: number,
		pixelHeight: number,
		boundaryWidth: number,
		boundaryHeight: number,
	) {
		//Set dimensions

		this.pixiApp = app;
		this.pixelWidth = pixelWidth;
		this.pixelHeight = pixelHeight;
		this.boundaryWidth = boundaryWidth;
		this.boundaryHeight = boundaryHeight;

		this.gameScreenData = new Screen_LayoutData();

		//Set listener for resize

		window.addEventListener('resize', () => {
			this.onResize();
		});

		//Force initial resize

		this.onResize();
	}

	public AddResizeCallback(callback: (data: Screen_LayoutData) => void) {
		if (
			this.callbacks.findIndex((existing) => {
				return existing === callback;
			}) === -1
		) {
			this.callbacks.push(callback);
		}
	}

	public RemoveResizeCallback(callback: (data: Screen_LayoutData) => void) {
		let index;
		if (
			(index = this.callbacks.findIndex((existing) => {
				return existing === callback;
			})) !== -1
		) {
			this.callbacks.splice(index, 1);
		}
	}

	public GetScreenLayoutData(): Screen_LayoutData {
		return this.gameScreenData;
	}

	protected onResize() {
		//Find the size of the relevant screen area

		this.gameScreenData.device_Width = document.documentElement.clientWidth;
		this.gameScreenData.device_Height =
			document.documentElement.clientHeight;
		this.gameScreenData.device_CenterX =
			this.gameScreenData.device_Width / 2;
		this.gameScreenData.device_CenterY =
			this.gameScreenData.device_Width / 2;

		this.FindBaseSize();

		let renderWidth;
		let renderHeight;
		let pixelWidth;
		let pixelHeight;
		let boundsWidth;
		let boundsHeight;
		if (this.gameScreenData.orientation === Screen_Orientation.Landscape) {
			pixelWidth = renderWidth = this.pixelWidth;
			pixelHeight = renderHeight = this.pixelHeight;
			boundsWidth = this.boundaryWidth;
			boundsHeight = this.boundaryHeight;
		} else {
			pixelWidth = renderWidth = this.pixelHeight;
			pixelHeight = renderHeight = this.pixelWidth;
			boundsWidth = this.boundaryHeight;
			boundsHeight = this.boundaryWidth;
		}

		let scaley = this.gameScreenData.device_Height / renderHeight;
		let scalex = this.gameScreenData.device_Width / renderWidth;
		const scale = Math.min(scalex, scaley);

		this.gameScreenData.scale = scale;

		//Allow more space to the side or top if available

		let extraPixelSpaceX: number =
			(this.gameScreenData.device_Width - renderWidth * scale) / scale;
		if (extraPixelSpaceX > boundsWidth - renderWidth) {
			extraPixelSpaceX = boundsWidth - renderWidth;
		}

		let extraPixelSpaceY: number =
			(this.gameScreenData.device_Height - renderHeight * scale) / scale;
		if (extraPixelSpaceY > boundsHeight - renderHeight) {
			extraPixelSpaceY = boundsHeight - renderHeight;
		}

		renderWidth += extraPixelSpaceX;
		renderHeight += extraPixelSpaceY;
		this.gameScreenData.width = renderWidth;
		this.gameScreenData.height = renderHeight;
		this.gameScreenData.offsetX =
			(this.gameScreenData.width - pixelWidth) / 2;
		this.gameScreenData.offsetY =
			(this.gameScreenData.height - pixelHeight) / 2;
		this.gameScreenData.centerX = pixelWidth / 2;
		this.gameScreenData.centerY = pixelHeight / 2;

		this.pixiApp.renderer.resize(
			this.gameScreenData.width,
			this.gameScreenData.height,
		);

		const offsetX =
			Math.max(
				this.gameScreenData.device_Width - renderWidth * scale,
				0,
			) / 2;
		const offsetY =
			Math.max(
				this.gameScreenData.device_Height - renderHeight * scale,
				0,
			) / 2;
		this.pixiApp.view.style.width = renderWidth * scale + 'px';
		this.pixiApp.view.style.height = renderHeight * scale + 'px';
		(<any>this.pixiApp.view.style).marginLeft = offsetX + 'px';
		(<any>this.pixiApp.view.style).marginTop = offsetY + 'px';

		//Handle callbacks to anyone listening for a screen resize

		// console.log(
		// 	'snc - screen callbacK:\n' + JSON.stringify(this.gameScreenData),
		// );

		this.callbacks.forEach((callback) => {
			callback(this.gameScreenData);
		});
	}

	protected FindBaseSize() {
		let orientation: Screen_Orientation;

		const screenAspectRatio =
			this.gameScreenData.device_Width /
			this.gameScreenData.device_Height;

		//Decide closest to landscape or portrait

		const distTo169 = Math.abs(screenAspectRatio - 16 / 9);
		const distTo916 = Math.abs(screenAspectRatio - 9 / 16);
		if (distTo916 > distTo169) {
			orientation = Screen_Orientation.Landscape;
		} else {
			orientation = Screen_Orientation.Portrait;
		}

		if (orientation != this.gameScreenData.orientation) {
			this.gameScreenData.orientation = orientation;
		}
	}
}
