/**
 * ReelsMachine_Reel.ts
 *
 * Reel handling logic for each reel in a machine
 */

import {
	ReelsMachine_Cell,
	Reelsmachine_Cell_HighlightMode,
} from './ReelsMachine_Cell';
import { RTTSheet } from '../../System/RenderToTextureHandling/RTTSheet';
import {
	ReelsMachine_CellSymbolMatchup,
	ReelsMachine_CellSymbolMatchup_Info,
} from './ReelsMachine_CellSymbolMatchup';
import { ReelsMachine_Config } from './ReelsMachine_Defines';
import { ReelsMachine_GridMesh } from './ReelsMachine_GridMesh';
import { ReelsMachine_SymbolStack } from './ReelsMachine_SymbolStack';
import { EASINGSUPPORT, HEARTBEAT } from '../../exports';

enum ReelsMachine_Reels_State {
	STOPPED = 'stopped',
	PULLBACK = 'pullback',
	RAMPUP = 'rampup',
	SPINNING = 'spinning',
	LANDING = 'landing',
	BOUNCEBACK = 'bouncback',
}

export class ReelsMachine_Reel {
	//Static data

	protected static symbolSheet: RTTSheet;

	public static SetSymbolInfo(symbolSheet: RTTSheet) {
		ReelsMachine_Reel.symbolSheet = symbolSheet;
	}

	//Class data

	protected reelIndex: number;
	protected cells: ReelsMachine_Cell[] = [];
	protected mesh: ReelsMachine_GridMesh;

	//Movement

	protected currentPosition: number = 0;
	protected referencePosition: number = 0;
	protected timeToStartSpin: number = 0;
	protected timeToStopSpin: number = 0;

	protected fullSpeedPerSecond: number = 10; //Number of symbols moved per second at full speed
	protected rampUpTime: number = 0; //Time from 0 to full speed on spin
	protected pullBackTime: number = 500; //Time from 0 to fully pulled back
	protected pullBackDistance: number = 0.5; //Distance to which the pull back is required

	protected pullBackStartTime: number = 0; //Time at which pull back started
	protected rampUpStartTime: number = 0; //Time at which ramp up started

	protected speedControl: number = 0; //General speed controller, normal 0-1
	protected directOffset: number = 0; //Offset rather than speed for pullback/bounceback
	protected useOffsetPosition: boolean = false; //Flag to move by offset rather than speed

	protected allCellsLanded: boolean = false;
	protected stopping: boolean = false;

	protected state: ReelsMachine_Reels_State =
		ReelsMachine_Reels_State.STOPPED;

	protected symbolStack: ReelsMachine_SymbolStack;

	constructor(
		definition: ReelsMachine_Config,
		reelIndex: number,
		firstCellIndex: number,
		numRows: number,
		baseX: number,
		baseY: number,
		cellYSpacing: number,
		mesh: ReelsMachine_GridMesh,
	) {
		this.reelIndex = reelIndex;
		this.mesh = mesh;
		this.symbolStack = new ReelsMachine_SymbolStack(
			definition.initialGrid[reelIndex],
		);

		//Allocate the correct number of cells

		for (let row: number = 0; row < numRows; row++) {
			const newCell = new ReelsMachine_Cell(
				this.reelIndex,
				row,
				firstCellIndex + row,
				baseX,
				baseY + row * cellYSpacing,
				definition.cellWidth,
				definition.cellHeight,
			);

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

		definition.slotMachineConfig.winLineData.forEach(
			(line, winLineIndex) => {
				if (line[this.reelIndex] !== undefined) {
					this.cells[line[this.reelIndex]].AddToWinlines(
						winLineIndex,
					);
				}
			},
		);
	}

	public GetState(): ReelsMachine_Reels_State {
		return this.state;
	}

	public IsSpinning(): boolean {
		return this.state !== ReelsMachine_Reels_State.STOPPED;
	}

	public IsStopping(): boolean {
		return this.state === ReelsMachine_Reels_State.STOPPED;
	}

	public FillSymbolsFromStack() {
		for (let row: number = 0; row < this.cells.length; row++) {
			const topSymbol = this.symbolStack.ReadStack(row).symbolInfo;
			const bottomSymbol = this.symbolStack.ReadStack(row + 1).symbolInfo;

			this.cells[row].SetBackgrounds(
				ReelsMachine_Reel.symbolSheet,
				topSymbol.backgroundID,
				bottomSymbol.backgroundID,
			);
			this.cells[row].SetSymbols(
				ReelsMachine_Reel.symbolSheet,
				topSymbol.symbolID,
				bottomSymbol.symbolID,
			);

			this.cells[row].UpdateMesh_BasicPositions(
				this.mesh.buffer_Position,
			);
			this.cells[row].UpdateMesh(
				this.mesh.buffer_Position,
				this.mesh.buffer_DarkLight,
				this.mesh.buffer_UV,
				this.mesh.buffer_BGUV,
			);
		}
	}

	public SetStartTime(time: number) {
		this.timeToStartSpin = time;
	}

	public SetStopTime(time: number) {
		this.timeToStopSpin = time + HEARTBEAT.timeNow;
		//NB This requires the landing symbols should be put into the reels from a suitable time
		//If the requet overrides a current one, only act if landing symbols aren't already filling
	}

	public SetLandedStack(symbols: number[]) {
		this.symbolStack.SetLandedStack(symbols);
	}

	public SetStackEntry(cellIndex: number, symbol: number) {
		this.symbolStack.WriteStack(cellIndex, symbol);
	}

	public Tick(delta: number, now: number) {
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

				const strength: number = EASINGSUPPORT.InSine(
					this.pullBackStartTime,
					HEARTBEAT.timeNow,
					this.pullBackTime,
				);

				this.directOffset = -this.pullBackDistance * strength;

				if (
					HEARTBEAT.timeNow >=
					this.pullBackStartTime + this.pullBackTime
				) {
					this.rampUpStartTime = HEARTBEAT.timeNow;
					this.currentPosition =
						this.referencePosition + this.directOffset;
					this.useOffsetPosition = false;
					this.state = ReelsMachine_Reels_State.RAMPUP;
				}
				break;

			case ReelsMachine_Reels_State.RAMPUP:
				//Build up to speed

				this.speedControl = EASINGSUPPORT.InSine(
					this.rampUpStartTime,
					HEARTBEAT.timeNow,
					this.rampUpTime,
				);

				if (
					HEARTBEAT.timeNow >=
					this.rampUpStartTime + this.rampUpTime
				) {
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
		} else {
			const thisSpeed: number =
				((this.fullSpeedPerSecond * delta) / 1000) * this.speedControl;
			this.currentPosition = this.currentPosition + thisSpeed;
		}

		const positionAtEnd = Math.floor(this.currentPosition);

		//Need to fill the cell symbols?

		if (positionAtEnd !== positionAtStart) {
			//Handle symbol change
			this.allCellsLanded = this.symbolStack.MoveStack(
				positionAtEnd - positionAtStart,
				this.state === ReelsMachine_Reels_State.LANDING,
			);
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
			cell.UpdateMesh_Contents(
				this.mesh.buffer_Position,
				this.mesh.buffer_UV,
				this.mesh.buffer_BGUV,
			);
		});
	}

	public ClearCellHighlights() {
		//Got through each cell and remove highlights

		this.cells.forEach((cell) => {
			cell.SetHighlightMode(Reelsmachine_Cell_HighlightMode.NORMAL);
		});
	}

	public HighlightWinLines(
		winLineFlags: number,
		activeBrightness: number,
		inactiveBrightness: number,
	) {
		//Got through each cell and remove highlights

		this.cells.forEach((cell) => {
			cell.SetHighlightMode(
				cell.winLineFlags & winLineFlags
					? Reelsmachine_Cell_HighlightMode.PULSE
					: Reelsmachine_Cell_HighlightMode.DARK,
			);
		});
	}
}
