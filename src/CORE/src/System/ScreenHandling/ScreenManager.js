export var Screen_Orientation;
(function (Screen_Orientation) {
    Screen_Orientation["Landscape"] = "landscape";
    Screen_Orientation["Portrait"] = "portrait";
})(Screen_Orientation || (Screen_Orientation = {}));
export class Screen_LayoutData {
    constructor() {
        this.orientation = Screen_Orientation.Landscape;
        //Device side
        this.device_Width = 1;
        this.device_Height = 1;
        this.device_CenterX = 0;
        this.device_CenterY = 0;
        //App side
        this.width = 0;
        this.height = 0;
        this.centerX = 0;
        this.centerY = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.scale = 0;
    }
}
export class ScreenManager {
    constructor(app, pixelWidth, pixelHeight, boundaryWidth, boundaryHeight) {
        //Set dimensions
        this.callbacks = [];
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
    AddResizeCallback(callback) {
        if (this.callbacks.findIndex((existing) => {
            return existing === callback;
        }) === -1) {
            this.callbacks.push(callback);
        }
    }
    RemoveResizeCallback(callback) {
        let index;
        if ((index = this.callbacks.findIndex((existing) => {
            return existing === callback;
        })) !== -1) {
            this.callbacks.splice(index, 1);
        }
    }
    GetScreenLayoutData() {
        return this.gameScreenData;
    }
    onResize() {
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
        }
        else {
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
        let extraPixelSpaceX = (this.gameScreenData.device_Width - renderWidth * scale) / scale;
        if (extraPixelSpaceX > boundsWidth - renderWidth) {
            extraPixelSpaceX = boundsWidth - renderWidth;
        }
        let extraPixelSpaceY = (this.gameScreenData.device_Height - renderHeight * scale) / scale;
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
        this.pixiApp.renderer.resize(this.gameScreenData.width, this.gameScreenData.height);
        const offsetX = Math.max(this.gameScreenData.device_Width - renderWidth * scale, 0) / 2;
        const offsetY = Math.max(this.gameScreenData.device_Height - renderHeight * scale, 0) / 2;
        this.pixiApp.view.style.width = renderWidth * scale + 'px';
        this.pixiApp.view.style.height = renderHeight * scale + 'px';
        this.pixiApp.view.style.marginLeft = offsetX + 'px';
        this.pixiApp.view.style.marginTop = offsetY + 'px';
        //Handle callbacks to anyone listening for a screen resize
        // console.log(
        // 	'snc - screen callbacK:\n' + JSON.stringify(this.gameScreenData),
        // );
        this.callbacks.forEach((callback) => {
            callback(this.gameScreenData);
        });
    }
    FindBaseSize() {
        let orientation;
        const screenAspectRatio = this.gameScreenData.device_Width /
            this.gameScreenData.device_Height;
        //Decide closest to landscape or portrait
        const distTo169 = Math.abs(screenAspectRatio - 16 / 9);
        const distTo916 = Math.abs(screenAspectRatio - 9 / 16);
        if (distTo916 > distTo169) {
            orientation = Screen_Orientation.Landscape;
        }
        else {
            orientation = Screen_Orientation.Portrait;
        }
        if (orientation != this.gameScreenData.orientation) {
            this.gameScreenData.orientation = orientation;
        }
    }
}
//# sourceMappingURL=ScreenManager.js.map