/**
 * RTTSheet.ts
 *
 * Render to texture sheet handling for matchup of name to sheet x,y,u,v data
 */
import * as PIXI from 'pixi.js';
const defaultLayout = {
    uniqueID: -1,
    ID: 'default',
    pixiRect: new PIXI.Rectangle(0, 0, 1, 1),
    pixiMask: new PIXI.Graphics(),
    minU: 0,
    minV: 0,
    maxU: 1,
    maxV: 1,
    minX: 0,
    maxX: 1,
    minY: 0,
    maxY: 1,
};
//NB Change this to an array of slots with IDs, allowing the IDs to become dynamic and marked as used/unused
export class RTTSheet {
    constructor(ID, width, height) {
        this.activePool = [];
        this.assignablePool = [];
        this.ID = ID;
        this.sheetWidth = width;
        this.sheetHeight = height;
        this.renderTexture = PIXI.RenderTexture.create({
            width: this.sheetWidth,
            height: this.sheetHeight,
        });
    }
    //Add data
    AddItemInfo_Active(ID, x, y, width, height) {
        this.internal_AddItemInfo(true, ID, x, y, width, height);
    }
    AddItemInfo_Assignable(ID, x, y, width, height) {
        this.internal_AddItemInfo(false, ID, x, y, width, height);
    }
    internal_AddItemInfo(active, ID, x, y, width, height) {
        //Create the new entry
        const maxX = x + width - 1;
        const maxY = y + height - 1;
        const pixiMask = new PIXI.Graphics();
        pixiMask.beginFill(0xffffff);
        pixiMask.drawRect(x, y, width, height);
        pixiMask.endFill();
        const info = {
            ID: ID,
            uniqueID: RTTSheet.nextUID++,
            pixiRect: new PIXI.Rectangle(x, y, width, height),
            pixiMask: pixiMask,
            minU: x / this.sheetWidth,
            minV: y / this.sheetHeight,
            maxU: maxX / this.sheetWidth,
            maxV: maxY / this.sheetHeight,
            minX: x,
            minY: y,
            maxX: maxX,
            maxY: maxY,
        };
        if (active) {
            this.activePool.push(info);
        }
        else {
            this.assignablePool.push(info);
        }
    }
    GetID() {
        return this.ID;
    }
    GetItemInfoByID(ID) {
        const info = this.activePool.find((existing) => {
            return existing.ID === ID;
        });
        if (info === undefined) {
            return defaultLayout;
        }
        return info;
    }
    GetItemInfoByUID(uniqueID) {
        const info = this.activePool.find((existing) => {
            return existing.uniqueID === uniqueID;
        });
        if (info === undefined) {
            return defaultLayout;
        }
        return info;
    }
    GetTexture() {
        return this.renderTexture;
    }
}
RTTSheet.nextUID = 0;
//# sourceMappingURL=RTTSheet.js.map