/**
 * PIXISystemDebugButton.ts
 *
 * Simple pixi button sending a message
 *
 */
import * as PIXI from 'pixi.js';
import { UISUPPORT } from '../Engine';
export class PIXISystemDebugButton extends PIXI.Container {
    constructor(x, y, width, height, colour, ID) {
        super();
        this.ID = ID;
        this.HandleClick = () => {
            UISUPPORT.UIButtonSignal.emit(this.ID);
        };
        this.x = x;
        this.y = y;
        this.graphic = new PIXI.Graphics();
        // Rectangle
        this.graphic.beginFill(colour);
        this.graphic.drawRect(0, 0, width, height);
        this.graphic.endFill();
        this.addChild(this.graphic);
        //this.interactive = true;
        this.eventMode = 'dynamic';
        this.on('pointertap', this.HandleClick, this);
    }
}
//# sourceMappingURL=PIXISystemDebugButton.js.map