// ================================================
// ENGINE DEPENDENCY IMPORTS
// ================================================

import * as PIXI from 'pixi.js';

import { PIXIReplacementApplication } from './PIXISystemClasses/PIXIReplacementApplication';
import { PIXISystemRootContainer } from './PIXISystemClasses/PIXISystemRootContainer';
import { PIXISystemDebugContainer } from './PIXISystemClasses/PIXISystemDebugContainer';
import {
	PIXISYSTEMUI_STYLE,
	PIXISystemUIContainer,
} from './PIXISystemClasses/PIXISystemUIContainer';

import { DebugSupport } from './DebugSupport/DebugSupport';
import { UISupport } from './UISupport/UISupport';
import { MultiLogger } from './MultiLogger/MultiLogger';

import { StateMachine } from './StateHandling/StateMachine';
import { StateBase } from './StateHandling/StateBase';

import { AssetHandler } from './AssetHandling/AssetHandler';
import { CountryCodeSupport } from './Utility/CountryCodeSupport';

import { SoundManager } from './SoundHandling/SoundManager';
import { PlatformSupport } from './Utility/PlatformSupport';

import { EasingSupport } from './Utility/EasingSupport';
import { ScreenManager } from './ScreenHandling/ScreenManager';

import { ShaderHandler } from './ShaderSupport/ShaderHandler';

import { BackendHandler } from './BackendHandling/BackendHandler';
import { SlotMachine } from './SlotMachineHandling/SlotMachine';
import { SlotMachine_Config } from './SlotMachineHandling/SlotMachine_Config';
import {
	BUILDTARGETOPTIONS,
	BuildTargetOptions,
} from './Utility/BuildTargetOptions';

import { HeartBeat } from './Heartbeat/Heartbeat';

import { MultiLanguageTranslation } from './MultiLanguageTranslation/MultiLanguageTranslation';

export type EngineParameters = {
	//Build target data

	buildTargetConfig: any;

	//Pixi setup
	htmlAttachElement: HTMLElement;
	initialWidth: number;
	initialHeight: number;
	UIStyle: PIXISYSTEMUI_STYLE;

	//Render via engine

	renderViaEngine: boolean;

	//Screen pixel sizes
	idealPixelWidth: number;
	idealPixelHeight: number;
	boundaryPixelWidth: number;
	boundaryPixelHeight: number;

	//States
	states: StateBase[];
	startState: string;

	//Slot machine
	slotMachineConfig: SlotMachine_Config;
};

/**
 * Core Graphics Engine based on top of THREE.js
 */
class Engine {
	//Flags for build types

	protected stateHandler: StateMachine;

	protected PIXIstage: PIXI.Container;
	protected PIXIapp: PIXIReplacementApplication;
	protected debugContainer: PIXISystemDebugContainer;
	protected uiContainer: PIXISystemUIContainer;

	//Keep slot machine and backend tucked behind engine class

	protected slotMachine: SlotMachine;
	protected slotBackend: BackendHandler;

	constructor() {
		if (ENGINE !== undefined) {
			return;
		}

		console.log('Creating Engine instance');

		ENGINE = this;

		//NB No setup yet, that had to come within the initialise so it can all be done at the correct time
	}

	public Initialise(setup: EngineParameters) {
		//Set up build target options

		new BuildTargetOptions(setup.buildTargetConfig);

		//Set up the logger

		LOGGER = new MultiLogger();
		LOGGER.SetRemoteURL(
			//'https://dstest.oinkygames.co.uk:3003',
			'http://127.0.0.1:3010',
			'snctestsession',
		);

		//Set up the slot backend and slot machine

		this.slotBackend = new BackendHandler();
		this.slotBackend.Init();
		SLOTMACHINE = new SlotMachine(setup.slotMachineConfig);

		//Set up the state managememt

		this.stateHandler = new StateMachine();
		setup.states.forEach((state) => {
			this.stateHandler.AddState(state);
		});

		//Initialise PIXI

		this.PIXIapp = new PIXIReplacementApplication({
			autoStart: false,
			resolution: 1,
			antialias: true,
			clearBeforeRender: true,
			powerPreference: 'high-performance',
			view: setup.htmlAttachElement as HTMLCanvasElement,
			width: setup.initialWidth,
			height: setup.initialHeight,
		});

		//Set up managers

		SCREENMANAGER = new ScreenManager(
			this.PIXIapp,
			setup.idealPixelWidth,
			setup.idealPixelHeight,
			setup.boundaryPixelWidth,
			setup.boundaryPixelHeight,
		);

		EASINGSUPPORT = new EasingSupport();
		PLATFORMSUPPORT = new PlatformSupport();
		COUNTRYCODESUPPORT = new CountryCodeSupport();
		ASSETHANDLER = new AssetHandler();
		SOUNDMANAGER = new SoundManager();
		SHADERHANDLER = new ShaderHandler();
		MLT = new MultiLanguageTranslation();

		//Setup root container

		this.PIXIstage = this.PIXIapp.stage;

		ROOTCONTAINER_GAME = new PIXISystemRootContainer(
			setup.idealPixelWidth,
			setup.idealPixelHeight,
		);
		this.PIXIstage.addChild(ROOTCONTAINER_GAME);

		//Setup UI container

		this.uiContainer = new PIXISystemUIContainer(
			setup.idealPixelWidth,
			setup.idealPixelHeight,
			setup.UIStyle,
		);
		this.PIXIstage.addChild(this.uiContainer);

		//Setup debug container

		this.debugContainer = new PIXISystemDebugContainer(
			setup.idealPixelWidth,
			setup.idealPixelHeight,
			PLATFORMSUPPORT.available_debug ? 4 : 0,
			PLATFORMSUPPORT.available_debug ? 4 : 0,
		);
		this.PIXIstage.addChild(this.debugContainer);

		// if (PLATFORMSUPPORT.available_debug) {
		// 	this.debugContainer.AddDebugLimit({
		// 		alpha: 0.25,
		// 		thickness: 5,
		// 		width: setup.boundaryPixelWidth,
		// 		height: setup.boundaryPixelHeight,
		// 		landscapeColour: 0xff00ff,
		// 		portraitColour: 0xff00ff,
		// 		centerX: setup.idealPixelWidth / 2,
		// 		centerY: setup.idealPixelHeight / 2,
		// 	});

		// 	this.debugContainer.AddDebugLimit({
		// 		alpha: 0.25,
		// 		thickness: 5,
		// 		width: setup.idealPixelWidth,
		// 		height: setup.idealPixelHeight,
		// 		landscapeColour: 0x00ffff,
		// 		portraitColour: 0xffff00,
		// 	});
		// }

		ROOTCONTAINER_GAME.SetResizeCallback();
		this.debugContainer.SetResizeCallback();
		this.uiContainer.SetResizeCallback();

		//Export debug and UI support

		DEBUGSUPPORT = new DebugSupport(this.debugContainer);
		UISUPPORT = new UISupport(this.uiContainer);

		//Set the 'next' stage

		this.SetState(setup.startState);

		//Set up the PIXI inspector plugin?

		if (BUILDTARGETOPTIONS.IsSet('inspectoravailable')) {
			(globalThis as any).__PIXI_APP__ = this.PIXIapp;

			(window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
				(window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__.register({
					PIXI: PIXI,
				});
		}

		//Export a common ticker for others to attach

		DISPLAYTICKER = this.PIXIapp.ticker; //TO BE SEPARATED!!!

		//Set up the heartbeat

		HEARTBEAT = new HeartBeat(this.PIXIapp.ticker);

		//Add the engine's heartbeat ticker

		HEARTBEAT.Add(this.Tick, 'ENGINE');

		//Render via engine?

		if (setup.renderViaEngine) {
			this.PIXIapp.renderViaEngine = true;
			HEARTBEAT.AddPostBeat(
				this.PIXIapp.engineDrivenRender,
				'ENGINE RENDER',
			);
		}

		//Start time

		this.PIXIapp.start();
	}

	public SetState(stageName: string) {
		this.stateHandler.SetNextState(stageName);
	}

	protected Tick = (delta: number, now: number) => {
		//Tick the sound manager

		SOUNDMANAGER.Tick(delta, HEARTBEAT.timeNow);

		//Pass any buttons down from the UI. Done here for consistent processing point

		UISUPPORT.UIButtonPassDownFromEngine();

		//Tick the state handler

		this.stateHandler.Tick();

		//Report state to debug

		if (PLATFORMSUPPORT.available_debug) {
			this.debugContainer.SetDebugText(
				0,
				'STATE: ' +
					this.stateHandler.GetState() +
					' (' +
					Math.floor(this.stateHandler.thisStateRunningTime / 100) /
						10 +
					's)',
			);
		}
	};

	protected EngineRender = () => {
		this.PIXIapp.engineDrivenRender();
	};

	public GetRenderer(): PIXI.Renderer {
		return <PIXI.Renderer>this.PIXIapp.renderer;
	}
}

export let ENGINE: Engine;
new Engine();

export let LOGGER: MultiLogger;

export let PIXISTAGE: PIXI.Container;

export let MLT: MultiLanguageTranslation;
export let HEARTBEAT: HeartBeat;
export let DISPLAYTICKER: PIXI.Ticker;
export let ROOTCONTAINER_GAME: PIXISystemRootContainer;
export let DEBUGSUPPORT: DebugSupport;
export let UISUPPORT: UISupport;
export let ASSETHANDLER: AssetHandler;
export let EASINGSUPPORT: EasingSupport;
export let PLATFORMSUPPORT: PlatformSupport;
export let COUNTRYCODESUPPORT: CountryCodeSupport;

export let SCREENMANAGER: ScreenManager;
export let SHADERHANDLER: ShaderHandler;
export let SLOTMACHINE: SlotMachine;
export let SOUNDMANAGER: SoundManager;
