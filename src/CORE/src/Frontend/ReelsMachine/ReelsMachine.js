/**
 * ReelsMachine.ts
 *
 * Main file for the code handling the core of the 'reels machine' which is the reel display for
 * the game.
 *
 * Reels machine is entirely logic side, create graphical components and steers them as needed
 */
import * as PIXI from 'pixi.js';
import { ReelsMachine_Reel } from './ReelsMachine_Reel';
import { SHADERHANDLER_SHADERS, SHADERHANDLER, HEARTBEAT } from '../../exports';
import { ReelsMachine_GridMesh } from './ReelsMachine_GridMesh';
import { ReelsMachine_SymbolStack } from './ReelsMachine_SymbolStack';
export class ReelsMachine {
    constructor(holder, definition) {
        //Create a holder for the different layers symbols (and items) can be placed upon
        //Data
        this.reelCells = [];
        this.reels = [];
        this.isSpinning = false;
        this.isStopping = false;
        this.isAllSpinning = false;
        this.isAllStopping = false;
        this.parentContainer = holder;
        this.backLayer = new PIXI.Container();
        this.midLayer = new PIXI.Container();
        this.frontLayer = new PIXI.Container();
        this.parentContainer.addChild(this.backLayer);
        this.parentContainer.addChild(this.midLayer);
        this.parentContainer.addChild(this.frontLayer);
        //Get the symbol information here and static for reels
        this.symbolSheet = definition.symbolSheet;
        this.symbolMatchup = definition.symbolMatchup;
        ReelsMachine_Reel.SetSymbolInfo(this.symbolSheet);
        ReelsMachine_SymbolStack.SetSymbolInfo(this.symbolSheet, this.symbolMatchup);
        //Determine the reel's top cell base position
        this.numRows = definition.slotMachineConfig.gridLayout[0];
        this.numColumns = definition.slotMachineConfig.gridLayout.length;
        this.cellWidth = definition.cellWidth;
        this.cellHeight = definition.cellHeight;
        this.cellSpacingX = this.cellWidth + definition.columnGap;
        this.cellSpacingY = this.cellHeight + definition.rowGap;
        const baseX = (-this.cellSpacingX * this.numColumns + definition.columnGap) / 2;
        const baseY = (-this.cellSpacingY * this.numRows + definition.rowGap) / 2;
        //Create the grid mesh to build/display
        this.gridMesh = new ReelsMachine_GridMesh();
        //Create geometry for each reel as well as the cell info
        let firstCellIndex = 0;
        for (let reel = 0; reel < this.numColumns; reel++) {
            const reelX = baseX + reel * this.cellSpacingX;
            const reelY = baseY;
            this.reels[reel] = new ReelsMachine_Reel(definition, reel, firstCellIndex, this.numRows, reelX, reelY, this.cellSpacingY, this.gridMesh);
            firstCellIndex += this.numRows;
        }
        //Create reel shader
        SHADERHANDLER.MakeShader('reelshader', SHADERHANDLER_SHADERS.REELTEST, {
            uSampler2: this.symbolSheet.GetTexture(),
            uAlpha: 1,
            uAdditiveColour: [1, 1, 1],
        });
        this.gridMesh.CreateMeshFromGeometry('reelshader');
        this.backLayer.addChild(this.gridMesh.mesh);
    }
    /**
     * Tick
     *
     * Tick the reel machine. The machine takes the delta and time params to enable it to run at a different rate if needed
     *
     * @param delta
     * @param now
     */
    Tick(delta, now) {
        this.isSpinning = false;
        this.isStopping = false;
        this.isAllSpinning = true;
        this.isAllStopping = true;
        this.reels.forEach((reel) => {
            reel.Tick(delta, now);
            if (reel.IsSpinning()) {
                this.isSpinning = true;
            }
            else {
                this.isAllSpinning = false;
            }
            if (reel.IsStopping()) {
                this.isStopping = true;
            }
            else {
                this.isAllStopping = false;
            }
        });
        this.gridMesh.Update();
    }
    //Control
    IsSpinning() {
        return this.isSpinning;
    }
    IsStopping() {
        return this.isStopping;
    }
    IsAllSpinning() {
        return this.isAllSpinning;
    }
    IsAllStopping() {
        return this.isAllStopping;
    }
    /**
     * Request_StartSpin
     *
     * @param msTillStartPerReel
     *
     * Sets the reels to start spinning at the required time
     * Ignore if already spinning
     */
    Request_StartSpin(msTillStartPerReel) {
        if (this.isSpinning) {
            return;
        }
        //Set the start spin times for the reels
        msTillStartPerReel.forEach((time, index) => {
            this.reels[index].SetStartTime(time + HEARTBEAT.timeNow);
        });
    }
    /**
     * Request_LandReels
     *
     * @param msTillStopPerReel
     *
     * Sets the reels to fill results and land (stop spinning) at the require time
     * NB These may be ignored/overridden if:
     * 1) A land is already in progress or complete on a reel
     */
    Request_LandReels(msTillStopPerReel) {
        //For each reel that is spinning, pass in the request
        this.reels.forEach((reel, index) => {
            if (reel.IsSpinning()) {
                reel.SetStopTime(msTillStopPerReel[index]);
            }
        });
    }
    /**
     * Request_SetLandGrid
     *
     * @param landedResults
     *
     * Sets up the symbols to fill into the reels
     */
    Request_SetLandGrid(landedResults) {
        landedResults.forEach((symbols, index) => {
            this.Request_SetLandReel(index, symbols);
        });
    }
    /**
     * Request_SetLandReel
     *
     * @param reelIndex
     * @param landedResults
     *
     * Sets up the symbols to fill into the specified reel
     */
    Request_SetLandReel(reelIndex, landedResults) {
        this.reels[reelIndex].SetLandedStack(landedResults);
    }
    /**
     * Request_FillGrid
     *
     * @param symbols
     *
     * Instantly fills the grid as needed
     */
    Request_FillGrid(symbols) {
        symbols.forEach((reelSymbols, reelIndex) => {
            this.Request_FillReel(reelIndex, reelSymbols);
        });
    }
    /**
     * Request_FillReel
     *
     * @param reelIndex
     * @param symbols
     */
    Request_FillReel(reelIndex, symbols) {
        symbols.forEach((symbol, cellIndex) => {
            this.reels[reelIndex].SetStackEntry(cellIndex + 1, symbol);
        });
        this.reels[reelIndex].FillSymbolsFromStack();
    }
    /**
     * Request_FillCell
     *
     * @param reelIndex
     * @param cellIndex
     * @param symbol
     */
    Request_FillCell(reelIndex, cellIndex, symbol) {
        this.reels[reelIndex].SetStackEntry(cellIndex + 1, symbol);
        this.reels[reelIndex].FillSymbolsFromStack();
    }
    Request_ClearCellHighlight() {
        //Reverts all cells to normal
        this.reels.forEach((reel) => {
            reel.ClearCellHighlights();
        });
    }
    Request_HighlightWinLines(winLineFlags, activeBrightness, inactiveBrightness) {
        this.reels.forEach((reel) => {
            reel.HighlightWinLines(winLineFlags, activeBrightness, inactiveBrightness);
        });
    }
}
//# sourceMappingURL=ReelsMachine.js.map