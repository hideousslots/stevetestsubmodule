/**
 * SimpleVisualReels.ts
 *
 * Very simple visual reels display to show states in the scene
 */
import * as PIXI from 'pixi.js';
import { PIXIContainerBase } from '../PIXIBaseClasses/PIXIContainerBase';
import { DEBUGSUPPORT } from '../../exports';
export class SimpleVisualReels extends PIXIContainerBase {
    constructor(config) {
        super();
        //Just display things in text for now
        this.symbolGrid = [];
        //Allow simple spacing for texts
        this.passedConfig = config;
        let width = this.passedConfig.reelCount * 40;
        let height = this.passedConfig.rowCount * 40;
        for (let reel = 0; reel < this.passedConfig.reelCount; reel++) {
            let x = -width / 2 + 40 * reel + 4;
            let y = -height / 2 + 4;
            for (let row = 0; row < this.passedConfig.rowCount; row++) {
                const newText = new PIXI.Text(this.passedConfig.symbolMap[Math.floor(Math.random() * this.passedConfig.symbolMap.length)], {
                    fontFamily: 'Arial',
                    fontSize: 16,
                    fill: 0xffffff,
                    align: 'center',
                });
                newText.position.set(x, y + row * 40);
                this.addChild(newText);
            }
        }
        const bounds = this.getBounds();
        DEBUGSUPPORT.SetText(2, 'reels bounds ' + JSON.stringify(bounds));
    }
}
//# sourceMappingURL=SimpleVisualReels.js.map