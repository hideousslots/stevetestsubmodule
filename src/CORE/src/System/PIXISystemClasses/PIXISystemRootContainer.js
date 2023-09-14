/**
 * PIXISystemRootContainer.ts
 *
 * Code to handle the root containers - this are system managed and hold the background and game for the game
 */
import * as PIXI from 'pixi.js';
import { SCREENMANAGER } from '../Engine';
export class PIXISystemRootContainer extends PIXI.Container {
    constructor(width, height) {
        //Handle creation of the normal container
        super();
        this.ResizeCallback = (screenData) => {
            this.HandleResizeCallback(screenData);
        };
    }
    SetResizeCallback() {
        SCREENMANAGER.AddResizeCallback(this.ResizeCallback);
        this.ResizeCallback(SCREENMANAGER.GetScreenLayoutData());
    }
    HandleResizeCallback(screenData) {
        this.position.x = screenData.offsetX;
        this.position.y = screenData.offsetY;
    }
}
//# sourceMappingURL=PIXISystemRootContainer.js.map