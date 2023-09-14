/**
 * ReelsMachine_Cell.ts
 *
 * Logical reel cell
 *
 * For update purposes, needs to know its reel index, and row index
 * and its first entry index into the overall reel cell mesh
 * and its current symbol
 */
export var Reelsmachine_Cell_HighlightMode;
(function (Reelsmachine_Cell_HighlightMode) {
    Reelsmachine_Cell_HighlightMode[Reelsmachine_Cell_HighlightMode["NORMAL"] = 0] = "NORMAL";
    Reelsmachine_Cell_HighlightMode[Reelsmachine_Cell_HighlightMode["DARK"] = 1] = "DARK";
    Reelsmachine_Cell_HighlightMode[Reelsmachine_Cell_HighlightMode["ON"] = 2] = "ON";
    Reelsmachine_Cell_HighlightMode[Reelsmachine_Cell_HighlightMode["PULSE"] = 3] = "PULSE";
})(Reelsmachine_Cell_HighlightMode || (Reelsmachine_Cell_HighlightMode = {}));
export var ReelsMachine_Cell_State;
(function (ReelsMachine_Cell_State) {
    ReelsMachine_Cell_State["NORMAL"] = "normal";
})(ReelsMachine_Cell_State || (ReelsMachine_Cell_State = {}));
export class ReelsMachine_Cell {
    constructor(reelIndex, rowIndex, firstIndexToMesh, left, top, width, height) {
        this.reelIndex = reelIndex;
        this.rowIndex = rowIndex;
        this.firstIndexToMesh = firstIndexToMesh;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        //Instance values
        this.winLineFlags = 0; //bit flags for winlines this cell is part of
        this.currentState = ReelsMachine_Cell_State.NORMAL;
        this.currentSymbols = ['1', '2']; //Symbol[0] is the one at the top of the cell (incoming), symbol[1] is the one at the bottom of the cell (current)
        this.currentSymbolData = [];
        this.currentBackgrounds = ['bgred', 'bggreen'];
        this.currentBackgroundData = [];
        this.cellOffset = 0; //How much of the top symbol is visible in the cell (0 shows all of lower symbol, 1 shows all of top symbol)
        this.symbolBGOffset = 0; //How much the symbol graphic is offset from the background
        //Brightness control
        this.highlightMode = Reelsmachine_Cell_HighlightMode.NORMAL;
        this.targetBrightness = 1;
        this.currentBrightness = 1;
    }
    AddToWinlines(winlineIndex) {
        this.winLineFlags |= 1 << winlineIndex;
    }
    SetState(state) {
        this.currentState = state;
    }
    SetSymbols(sheet, topSymbol, botSymbol) {
        this.currentSymbols[0] = topSymbol;
        this.currentSymbols[1] = botSymbol;
        this.currentSymbolData[0] = sheet.GetItemInfoByID(this.currentSymbols[0]);
        this.currentSymbolData[1] = sheet.GetItemInfoByID(this.currentSymbols[1]);
    }
    SetBackgrounds(sheet, topBG, botBG) {
        this.currentBackgrounds[0] = topBG;
        this.currentBackgrounds[1] = botBG;
        this.currentBackgroundData[0] = sheet.GetItemInfoByID(this.currentBackgrounds[0]);
        this.currentBackgroundData[1] = sheet.GetItemInfoByID(this.currentBackgrounds[1]);
    }
    SetCellOffset(offset) {
        this.cellOffset = offset;
    }
    SetHighlightMode(mode) {
        this.highlightMode = mode;
        this.targetBrightness =
            ReelsMachine_Cell.highlightStrength[this.highlightMode];
    }
    Tick(delta, now, darkLightBuffer) {
        let needDarkLightUpdate = false;
        //Handle brightness changes (based on mode)
        if (this.targetBrightness > this.currentBrightness) {
            this.currentBrightness += 0.125;
            if (this.currentBrightness > this.targetBrightness) {
                this.currentBrightness = this.targetBrightness;
            }
            needDarkLightUpdate = true;
        }
        else if (this.targetBrightness < this.currentBrightness) {
            this.currentBrightness -= 0.125;
            if (this.currentBrightness < this.targetBrightness) {
                this.currentBrightness = this.targetBrightness;
            }
            needDarkLightUpdate = true;
        }
        if (needDarkLightUpdate) {
            this.UpdateMesh_SetHighlight(darkLightBuffer);
        }
    }
    UpdateMesh(posBuffer, darkLightBuffer, UVBuffer, BGUVBuffer) {
        this.UpdateMesh_SetHighlight(darkLightBuffer);
        this.UpdateMesh_Contents(posBuffer, UVBuffer, BGUVBuffer);
    }
    //Separate updates
    UpdateMesh_BasicPositions(buffer) {
        //Find base index into buffer
        const fillIndex = this.firstIndexToMesh * 12 * 2;
        //Fill it
        buffer[fillIndex + 0] =
            buffer[fillIndex + 6] =
                buffer[fillIndex + 10] =
                    buffer[fillIndex + 12] =
                        buffer[fillIndex + 18] =
                            buffer[fillIndex + 22] =
                                this.left;
        buffer[fillIndex + 2] =
            buffer[fillIndex + 4] =
                buffer[fillIndex + 8] =
                    buffer[fillIndex + 14] =
                        buffer[fillIndex + 16] =
                            buffer[fillIndex + 20] =
                                this.left + this.width;
        buffer[fillIndex + 1] =
            buffer[fillIndex + 3] =
                buffer[fillIndex + 7] =
                    this.top;
        buffer[fillIndex + 5] =
            buffer[fillIndex + 9] =
                buffer[fillIndex + 11] =
                    buffer[fillIndex + 13] =
                        buffer[fillIndex + 15] =
                            buffer[fillIndex + 17] =
                                buffer[fillIndex + 19] =
                                    buffer[fillIndex + 21] =
                                        buffer[fillIndex + 23] =
                                            this.top + this.height;
    }
    UpdateMesh_Contents(posBuffer, UVBuffer, BGUVBuffer) {
        //Find the base indices
        const posFillIndex = this.firstIndexToMesh * 12 * 2;
        const UVFillIndex = this.firstIndexToMesh * 12 * 2;
        const BGUVFillIndex = this.firstIndexToMesh * 12 * 2;
        //Set the midline position
        const midLineY = posBuffer[posFillIndex + 1] +
            (posBuffer[posFillIndex + 21] - posBuffer[posFillIndex + 1]) *
                this.cellOffset;
        posBuffer[posFillIndex + 5] =
            posBuffer[posFillIndex + 9] =
                posBuffer[posFillIndex + 11] =
                    posBuffer[posFillIndex + 13] =
                        posBuffer[posFillIndex + 15] =
                            posBuffer[posFillIndex + 19] =
                                midLineY;
        //Set the U and V values for top and lower symbols and backgrounds
        UVBuffer[UVFillIndex + 0] =
            UVBuffer[UVFillIndex + 6] =
                UVBuffer[UVFillIndex + 10] =
                    this.currentSymbolData[0].minU;
        UVBuffer[UVFillIndex + 2] =
            UVBuffer[UVFillIndex + 4] =
                UVBuffer[UVFillIndex + 8] =
                    this.currentSymbolData[0].maxU;
        UVBuffer[UVFillIndex + 12] =
            UVBuffer[UVFillIndex + 18] =
                UVBuffer[UVFillIndex + 22] =
                    this.currentSymbolData[1].minU;
        UVBuffer[UVFillIndex + 14] =
            UVBuffer[UVFillIndex + 16] =
                UVBuffer[UVFillIndex + 20] =
                    this.currentSymbolData[1].maxU;
        BGUVBuffer[BGUVFillIndex + 0] =
            BGUVBuffer[BGUVFillIndex + 6] =
                BGUVBuffer[BGUVFillIndex + 10] =
                    this.currentBackgroundData[0].minU;
        BGUVBuffer[BGUVFillIndex + 2] =
            BGUVBuffer[BGUVFillIndex + 4] =
                BGUVBuffer[BGUVFillIndex + 8] =
                    this.currentBackgroundData[0].maxU;
        BGUVBuffer[BGUVFillIndex + 12] =
            BGUVBuffer[BGUVFillIndex + 18] =
                BGUVBuffer[BGUVFillIndex + 22] =
                    this.currentBackgroundData[1].minU;
        BGUVBuffer[BGUVFillIndex + 14] =
            BGUVBuffer[BGUVFillIndex + 16] =
                BGUVBuffer[BGUVFillIndex + 20] =
                    this.currentBackgroundData[1].maxU;
        //Set the v to apply to the top of top symbol
        const topLineV = this.currentSymbolData[0].maxV -
            (this.currentSymbolData[0].maxV - this.currentSymbolData[0].minV) *
                this.cellOffset;
        UVBuffer[UVFillIndex + 1] =
            UVBuffer[UVFillIndex + 3] =
                UVBuffer[UVFillIndex + 7] =
                    topLineV;
        const topLineBGV = this.currentBackgroundData[0].maxV -
            (this.currentBackgroundData[0].maxV -
                this.currentBackgroundData[0].minV) *
                this.cellOffset;
        BGUVBuffer[BGUVFillIndex + 1] =
            BGUVBuffer[BGUVFillIndex + 3] =
                BGUVBuffer[BGUVFillIndex + 7] =
                    topLineBGV;
        //Set known V for bottom of top symbol
        UVBuffer[UVFillIndex + 5] =
            UVBuffer[UVFillIndex + 9] =
                UVBuffer[UVFillIndex + 11] =
                    this.currentSymbolData[0].maxV;
        BGUVBuffer[BGUVFillIndex + 5] =
            BGUVBuffer[BGUVFillIndex + 9] =
                BGUVBuffer[BGUVFillIndex + 11] =
                    this.currentBackgroundData[0].maxV;
        //Set known V for top of lower symbol
        UVBuffer[UVFillIndex + 13] =
            UVBuffer[UVFillIndex + 19] =
                UVBuffer[UVFillIndex + 15] =
                    this.currentSymbolData[1].minV;
        BGUVBuffer[BGUVFillIndex + 13] =
            BGUVBuffer[BGUVFillIndex + 19] =
                BGUVBuffer[BGUVFillIndex + 15] =
                    this.currentBackgroundData[1].minV;
        //Set lower V for bottom of lower symbol
        const botLineV = this.currentSymbolData[1].minV +
            (this.currentSymbolData[1].maxV - this.currentSymbolData[1].minV) *
                (1 - this.cellOffset);
        UVBuffer[UVFillIndex + 17] =
            UVBuffer[UVFillIndex + 21] =
                UVBuffer[UVFillIndex + 23] =
                    botLineV;
        const botLineBGV = this.currentBackgroundData[1].minV +
            (this.currentBackgroundData[1].maxV -
                this.currentBackgroundData[1].minV) *
                (1 - this.cellOffset);
        BGUVBuffer[BGUVFillIndex + 17] =
            BGUVBuffer[BGUVFillIndex + 21] =
                BGUVBuffer[BGUVFillIndex + 23] =
                    botLineBGV;
    }
    UpdateMesh_SetHighlight(buffer) {
        let additiveBrightness = 0;
        if (this.currentBrightness > 1) {
            additiveBrightness = this.currentBrightness * 0.15;
        }
        //Find base index into buffer
        const fillIndex = this.firstIndexToMesh * 12 * 2;
        //Fill it
        for (let index = 0; index < 12 * 2; index += 2) {
            buffer[fillIndex + index] = this.currentBrightness;
            buffer[fillIndex + index + 1] = additiveBrightness;
        }
    }
}
//Static values
ReelsMachine_Cell.highlightStrength = [
    //NORMAL
    1,
    //DARK
    0.5,
    //ON
    2.0,
    //PULSE
    2.0,
];
ReelsMachine_Cell.highlightTime_adjust = 0.1;
ReelsMachine_Cell.highlightTime_secondsPerPulse = 1.0;
//# sourceMappingURL=ReelsMachine_Cell.js.map