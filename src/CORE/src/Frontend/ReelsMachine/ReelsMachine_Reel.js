/**
 * ReelsMachine_Reel.ts
 *
 * Reel handling logic for each reel in a machine
 */
import { ReelsMachine_Cell, Reelsmachine_Cell_HighlightMode, } from './ReelsMachine_Cell';
import { ReelsMachine_SymbolStack } from './ReelsMachine_SymbolStack';
import { EASINGSUPPORT, HEARTBEAT } from '../../exports';
var ReelsMachine_Reels_State;
(function (ReelsMachine_Reels_State) {
    ReelsMachine_Reels_State["STOPPED"] = "stopped";
    ReelsMachine_Reels_State["PULLBACK"] = "pullback";
    ReelsMachine_Reels_State["RAMPUP"] = "rampup";
    ReelsMachine_Reels_State["SPINNING"] = "spinning";
    ReelsMachine_Reels_State["LANDING"] = "landing";
    ReelsMachine_Reels_State["BOUNCEBACK"] = "bouncback";
})(ReelsMachine_Reels_State || (ReelsMachine_Reels_State = {}));
export class ReelsMachine_Reel {
    static SetSymbolInfo(symbolSheet) {
        ReelsMachine_Reel.symbolSheet = symbolSheet;
    }
    constructor(definition, reelIndex, firstCellIndex, numRows, baseX, baseY, cellYSpacing, mesh) {
        this.cells = [];
        //Movement
        this.currentPosition = 0;
        this.referencePosition = 0;
        this.timeToStartSpin = 0;
        this.timeToStopSpin = 0;
        this.fullSpeedPerSecond = 10; //Number of symbols moved per second at full speed
        this.rampUpTime = 0; //Time from 0 to full speed on spin
        this.pullBackTime = 500; //Time from 0 to fully pulled back
        this.pullBackDistance = 0.5; //Distance to which the pull back is required
        this.pullBackStartTime = 0; //Time at which pull back started
        this.rampUpStartTime = 0; //Time at which ramp up started
        this.speedControl = 0; //General speed controller, normal 0-1
        this.directOffset = 0; //Offset rather than speed for pullback/bounceback
        this.useOffsetPosition = false; //Flag to move by offset rather than speed
        this.allCellsLanded = false;
        this.stopping = false;
        this.state = ReelsMachine_Reels_State.STOPPED;
        this.reelIndex = reelIndex;
        this.mesh = mesh;
        this.symbolStack = new ReelsMachine_SymbolStack(definition.initialGrid[reelIndex]);
        //Allocate the correct number of cells
        for (let row = 0; row < numRows; row++) {
            const newCell = new ReelsMachine_Cell(this.reelIndex, row, firstCellIndex + row, baseX, baseY + row * cellYSpacing, definition.cellWidth, definition.cellHeight);
            this.cells[row] = newCell;
        }
        this.FillSymbolsFromStack();
        //Set the visual control
        this.fullSpeedPerSecond =
            definition.visualControl.symbolsPerSecondFullSpeed;
        this.rampUpTime = definition.visualControl.rampUpTime;
        this.pullBackDistance = definition.visualControl.pullbackDistance;
        this.pullBackTime = definition.visualControl.pullbackTime;
        //Note winlines in cells
        definition.slotMachineConfig.winLineData.forEach((line, winLineIndex) => {
            if (line[this.reelIndex] !== undefined) {
                this.cells[line[this.reelIndex]].AddToWinlines(winLineIndex);
            }
        });
    }
    GetState() {
        return this.state;
    }
    IsSpinning() {
        return this.state !== ReelsMachine_Reels_State.STOPPED;
    }
    IsStopping() {
        return this.state === ReelsMachine_Reels_State.STOPPED;
    }
    FillSymbolsFromStack() {
        for (let row = 0; row < this.cells.length; row++) {
            const topSymbol = this.symbolStack.ReadStack(row).symbolInfo;
            const bottomSymbol = this.symbolStack.ReadStack(row + 1).symbolInfo;
            this.cells[row].SetBackgrounds(ReelsMachine_Reel.symbolSheet, topSymbol.backgroundID, bottomSymbol.backgroundID);
            this.cells[row].SetSymbols(ReelsMachine_Reel.symbolSheet, topSymbol.symbolID, bottomSymbol.symbolID);
            this.cells[row].UpdateMesh_BasicPositions(this.mesh.buffer_Position);
            this.cells[row].UpdateMesh(this.mesh.buffer_Position, this.mesh.buffer_DarkLight, this.mesh.buffer_UV, this.mesh.buffer_BGUV);
        }
    }
    SetStartTime(time) {
        this.timeToStartSpin = time;
    }
    SetStopTime(time) {
        this.timeToStopSpin = time + HEARTBEAT.timeNow;
        //NB This requires the landing symbols should be put into the reels from a suitable time
        //If the requet overrides a current one, only act if landing symbols aren't already filling
    }
    SetLandedStack(symbols) {
        this.symbolStack.SetLandedStack(symbols);
    }
    SetStackEntry(cellIndex, symbol) {
        this.symbolStack.WriteStack(cellIndex, symbol);
    }
    Tick(delta, now) {
        switch (this.state) {
            case ReelsMachine_Reels_State.STOPPED:
                if (this.timeToStartSpin !== 0) {
                    if (this.timeToStartSpin < now) {
                        if (this.state === ReelsMachine_Reels_State.STOPPED) {
                            //Get the stack to form a default landing stack
                            this.symbolStack.SetLandedStack([]);
                            //Start spinning
                            this.state = ReelsMachine_Reels_State.PULLBACK;
                            this.timeToStartSpin = 0;
                            this.pullBackStartTime = HEARTBEAT.timeNow;
                            this.referencePosition = this.currentPosition;
                            this.speedControl = 0;
                            this.directOffset = 0;
                            this.useOffsetPosition = true;
                            this.allCellsLanded = false;
                        }
                    }
                }
                break;
            case ReelsMachine_Reels_State.PULLBACK:
                //For now go straight to rampup
                const strength = EASINGSUPPORT.InSine(this.pullBackStartTime, HEARTBEAT.timeNow, this.pullBackTime);
                this.directOffset = -this.pullBackDistance * strength;
                if (HEARTBEAT.timeNow >=
                    this.pullBackStartTime + this.pullBackTime) {
                    this.rampUpStartTime = HEARTBEAT.timeNow;
                    this.currentPosition =
                        this.referencePosition + this.directOffset;
                    this.useOffsetPosition = false;
                    this.state = ReelsMachine_Reels_State.RAMPUP;
                }
                break;
            case ReelsMachine_Reels_State.RAMPUP:
                //Build up to speed
                this.speedControl = EASINGSUPPORT.InSine(this.rampUpStartTime, HEARTBEAT.timeNow, this.rampUpTime);
                if (HEARTBEAT.timeNow >=
                    this.rampUpStartTime + this.rampUpTime) {
                    this.speedControl = 1;
                    this.state = ReelsMachine_Reels_State.SPINNING;
                }
                break;
            case ReelsMachine_Reels_State.SPINNING:
                if (this.timeToStopSpin !== 0) {
                    if (this.timeToStopSpin < now) {
                        //Set to stop spinning if possible
                        if (this.state === ReelsMachine_Reels_State.SPINNING) {
                            //Start landing
                            this.state = ReelsMachine_Reels_State.LANDING;
                            this.timeToStopSpin = 0;
                        }
                    }
                }
                break;
            case ReelsMachine_Reels_State.LANDING:
                //When all have landed, go to boundeback (for now stop instantly)
                if (this.allCellsLanded) {
                    this.speedControl = 0;
                    this.state = ReelsMachine_Reels_State.BOUNCEBACK;
                }
                break;
            case ReelsMachine_Reels_State.BOUNCEBACK:
                //For now back to stopped
                this.speedControl = 0;
                this.currentPosition = Math.floor(this.currentPosition);
                this.state = ReelsMachine_Reels_State.STOPPED;
                break;
        }
        //Move the position, and update reels as needed
        const positionAtStart = Math.floor(this.currentPosition);
        if (this.useOffsetPosition) {
            this.currentPosition = this.referencePosition + this.directOffset;
        }
        else {
            const thisSpeed = ((this.fullSpeedPerSecond * delta) / 1000) * this.speedControl;
            this.currentPosition = this.currentPosition + thisSpeed;
        }
        const positionAtEnd = Math.floor(this.currentPosition);
        //Need to fill the cell symbols?
        if (positionAtEnd !== positionAtStart) {
            //Handle symbol change
            this.allCellsLanded = this.symbolStack.MoveStack(positionAtEnd - positionAtStart, this.state === ReelsMachine_Reels_State.LANDING);
            this.FillSymbolsFromStack();
        }
        //Ensure position is valid
        if (this.currentPosition < 0) {
            this.currentPosition = 1 - (Math.abs(this.currentPosition) % 1);
            this.referencePosition = 1 - (Math.abs(this.referencePosition) % 1);
        }
        this.cells.forEach((cell) => {
            cell.Tick(delta, now, this.mesh.buffer_DarkLight);
            cell.SetCellOffset((this.currentPosition + 1) % 1); //+1 on position to account for negative positioning on spinback
            cell.UpdateMesh_Contents(this.mesh.buffer_Position, this.mesh.buffer_UV, this.mesh.buffer_BGUV);
        });
    }
    ClearCellHighlights() {
        //Got through each cell and remove highlights
        this.cells.forEach((cell) => {
            cell.SetHighlightMode(Reelsmachine_Cell_HighlightMode.NORMAL);
        });
    }
    HighlightWinLines(winLineFlags, activeBrightness, inactiveBrightness) {
        //Got through each cell and remove highlights
        this.cells.forEach((cell) => {
            cell.SetHighlightMode(cell.winLineFlags & winLineFlags
                ? Reelsmachine_Cell_HighlightMode.PULSE
                : Reelsmachine_Cell_HighlightMode.DARK);
        });
    }
}
//# sourceMappingURL=ReelsMachine_Reel.js.map