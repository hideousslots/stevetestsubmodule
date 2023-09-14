/**
 * PIXISystemDebugContainer.ts
 *
 * Code to handle debug functions in a root container
 *
 * Some function exposed to application
 */
import * as PIXI from 'pixi.js';
import { SCREENMANAGER } from '../Engine';
import { PIXISystemRootContainer } from './PIXISystemRootContainer';
export var PIXISYSTEMUI_ANCHORID;
(function (PIXISYSTEMUI_ANCHORID) {
    PIXISYSTEMUI_ANCHORID[PIXISYSTEMUI_ANCHORID["TOPLEFT"] = 0] = "TOPLEFT";
    PIXISYSTEMUI_ANCHORID[PIXISYSTEMUI_ANCHORID["TOPMIDDLE"] = 1] = "TOPMIDDLE";
    PIXISYSTEMUI_ANCHORID[PIXISYSTEMUI_ANCHORID["TOPRIGHT"] = 2] = "TOPRIGHT";
    PIXISYSTEMUI_ANCHORID[PIXISYSTEMUI_ANCHORID["LEFT"] = 3] = "LEFT";
    PIXISYSTEMUI_ANCHORID[PIXISYSTEMUI_ANCHORID["CENTER"] = 4] = "CENTER";
    PIXISYSTEMUI_ANCHORID[PIXISYSTEMUI_ANCHORID["RIGHT"] = 5] = "RIGHT";
    PIXISYSTEMUI_ANCHORID[PIXISYSTEMUI_ANCHORID["BOTTOMLEFT"] = 6] = "BOTTOMLEFT";
    PIXISYSTEMUI_ANCHORID[PIXISYSTEMUI_ANCHORID["BOTTOMMIDDLE"] = 7] = "BOTTOMMIDDLE";
    PIXISYSTEMUI_ANCHORID[PIXISYSTEMUI_ANCHORID["BOTTOMRIGHT"] = 8] = "BOTTOMRIGHT";
    PIXISYSTEMUI_ANCHORID[PIXISYSTEMUI_ANCHORID["COUNT"] = 9] = "COUNT";
})(PIXISYSTEMUI_ANCHORID || (PIXISYSTEMUI_ANCHORID = {}));
export var PIXISYSTEMUI_STYLE;
(function (PIXISYSTEMUI_STYLE) {
    PIXISYSTEMUI_STYLE["FIXEDRATIO"] = "fixedratio";
    PIXISYSTEMUI_STYLE["VISIBLEBOUNDS"] = "visiblebounds";
})(PIXISYSTEMUI_STYLE || (PIXISYSTEMUI_STYLE = {}));
export class PIXISystemUIContainer extends PIXISystemRootContainer {
    constructor(width, height, style) {
        //Handle creation of the normal container
        super(width, height);
        this.anchors = [];
        //Create the anchor holders
        for (let i = 0; i < PIXISYSTEMUI_ANCHORID.COUNT; i++) {
            const holder = new PIXI.Container();
            const graphics = new PIXI.Graphics();
            graphics.lineStyle(5, 0x00ff00);
            graphics.drawCircle(0, 0, 5);
            holder.addChild(graphics);
            this.anchors[i] = holder;
            this.addChild(this.anchors[i]);
        }
        this.SetStyle(style);
    }
    //Public functions
    SetStyle(style) {
        this.style = style;
        //Rebuild positions based on screen manager info
        const screenData = SCREENMANAGER.GetScreenLayoutData();
        this.SetAnchorPositions(screenData.width, screenData.height, screenData.offsetX, screenData.offsetY);
    }
    GetAnchor(id) {
        return this.anchors[id];
    }
    //Internal handling
    SetAnchorPositions(refWidth, refHeight, extensionX, extensionY) {
        let top = 0;
        let bot = refHeight;
        let left = 0;
        let right = refWidth;
        if (this.style === PIXISYSTEMUI_STYLE.VISIBLEBOUNDS) {
            top -= extensionY;
            bot -= extensionY;
            left -= extensionX;
            right -= extensionX;
        }
        else {
            bot -= extensionY * 2;
            right -= extensionX * 2;
        }
        this.anchors[PIXISYSTEMUI_ANCHORID.TOPLEFT].position.set(left, top);
        this.anchors[PIXISYSTEMUI_ANCHORID.TOPMIDDLE].position.set((left + right) / 2, top);
        this.anchors[PIXISYSTEMUI_ANCHORID.TOPRIGHT].position.set(right, top);
        this.anchors[PIXISYSTEMUI_ANCHORID.LEFT].position.set(left, (top + bot) / 2);
        this.anchors[PIXISYSTEMUI_ANCHORID.CENTER].position.set((left + right) / 2, (top + bot) / 2);
        this.anchors[PIXISYSTEMUI_ANCHORID.RIGHT].position.set(right, (top + bot) / 2);
        this.anchors[PIXISYSTEMUI_ANCHORID.BOTTOMLEFT].position.set(left, bot);
        this.anchors[PIXISYSTEMUI_ANCHORID.BOTTOMMIDDLE].position.set((left + right) / 2, bot);
        this.anchors[PIXISYSTEMUI_ANCHORID.BOTTOMRIGHT].position.set(right, bot);
    }
    HandleResizeCallback(screenData) {
        super.HandleResizeCallback(screenData);
        //Change the position of the anchors
        this.SetAnchorPositions(screenData.width, screenData.height, screenData.offsetX, screenData.offsetY);
    }
}
//# sourceMappingURL=PIXISystemUIContainer.js.map