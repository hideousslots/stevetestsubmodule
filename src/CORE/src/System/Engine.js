// ================================================
// ENGINE DEPENDENCY IMPORTS
// ================================================
import * as PIXI from 'pixi.js';
import { PIXISystemRootContainer } from './PIXISystemClasses/PIXISystemRootContainer';
import { PIXISystemDebugContainer } from './PIXISystemClasses/PIXISystemDebugContainer';
import { PIXISystemUIContainer, } from './PIXISystemClasses/PIXISystemUIContainer';
import { DebugSupport } from './DebugSupport/DebugSupport';
import { UISupport } from './UISupport/UISupport';
import { MultiLogger } from './MultiLogger/MultiLogger';
import { StateMachine } from './StateHandling/StateMachine';
import { AssetHandler } from './AssetHandling/AssetHandler';
import { CountryCodeSupport } from './Utility/CountryCodeSupport';
import { SoundManager } from './SoundHandling/SoundManager';
import { PlatformSupport } from './Utility/PlatformSupport';
import { EasingSupport } from './Utility/EasingSupport';
import { ScreenManager } from './ScreenHandling/ScreenManager';
import { ShaderHandler } from './ShaderSupport/ShaderHandler';
import { BackendHandler } from './BackendHandling/BackendHandler';
import { SlotMachine } from './SlotMachineHandling/SlotMachine';
import { BUILDTARGETOPTIONS, BuildTargetOptions, } from './Utility/BuildTargetOptions';
import { HeartBeat } from './Heartbeat/Heartbeat';
import { MultiLanguageTranslation } from './MultiLanguageTranslation/MultiLanguageTranslation';
/**
 * Core Graphics Engine based on top of THREE.js
 */
class Engine {
    constructor() {
        this.Tick = (delta, now) => {
            //Tick the sound manager
            SOUNDMANAGER.Tick(delta, HEARTBEAT.timeNow);
            //Tick the state handler
            this.stateHandler.Tick();
            //Report state to debug
            if (PLATFORMSUPPORT.available_debug) {
                this.debugContainer.SetDebugText(0, 'STATE: ' +
                    this.stateHandler.GetState() +
                    ' (' +
                    Math.floor(this.stateHandler.thisStateRunningTime / 100) /
                        10 +
                    's)');
            }
        };
        if (ENGINE !== undefined) {
            return;
        }
        console.log('Creating Engine instance');
        ENGINE = this;
        //NB No setup yet, that had to come within the initialise so it can all be done at the correct time
    }
    Initialise(setup) {
        //Set up build target options
        new BuildTargetOptions(setup.buildTargetConfig);
        //Set up the logger
        LOGGER = new MultiLogger();
        LOGGER.SetRemoteURL(
        //'https://dstest.oinkygames.co.uk:3003',
        'http://127.0.0.1:3010', 'snctestsession');
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
        this.PIXIapp = new PIXI.Application({
            autoStart: true,
            resolution: 1,
            antialias: true,
            clearBeforeRender: true,
            powerPreference: 'high-performance',
            view: setup.htmlAttachElement,
            width: setup.initialWidth,
            height: setup.initialHeight,
        });
        //Set up managers
        SCREENMANAGER = new ScreenManager(this.PIXIapp, setup.idealPixelWidth, setup.idealPixelHeight, setup.boundaryPixelWidth, setup.boundaryPixelHeight);
        EASINGSUPPORT = new EasingSupport();
        PLATFORMSUPPORT = new PlatformSupport();
        COUNTRYCODESUPPORT = new CountryCodeSupport();
        ASSETHANDLER = new AssetHandler();
        SOUNDMANAGER = new SoundManager();
        SHADERHANDLER = new ShaderHandler();
        MLT = new MultiLanguageTranslation();
        //Setup root container
        this.PIXIstage = this.PIXIapp.stage;
        ROOTCONTAINER_GAME = new PIXISystemRootContainer(setup.idealPixelWidth, setup.idealPixelHeight);
        this.PIXIstage.addChild(ROOTCONTAINER_GAME);
        //Setup UI container
        this.uiContainer = new PIXISystemUIContainer(setup.idealPixelWidth, setup.idealPixelHeight, setup.UIStyle);
        this.PIXIstage.addChild(this.uiContainer);
        //Setup debug container
        this.debugContainer = new PIXISystemDebugContainer(setup.idealPixelWidth, setup.idealPixelHeight, PLATFORMSUPPORT.available_debug ? 4 : 0, PLATFORMSUPPORT.available_debug ? 4 : 0);
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
        //Set up the heartbeat
        HEARTBEAT = new HeartBeat(this.PIXIapp.ticker);
        //Add the engine's heartbeat ticker
        HEARTBEAT.Add(this.Tick, 'ENGINE');
        //this.PIXIapp.ticker.add(this.Tick, this);
        //Export a common ticker for others to attach
        DISPLAYTICKER = this.PIXIapp.ticker; //TO BE SEPARATED!!!
        //Set the 'next' stage
        this.SetState(setup.startState);
        //Set up the PIXI inspector plugin?
        if (BUILDTARGETOPTIONS.IsSet('inspectoravailable')) {
            globalThis.__PIXI_APP__ = this.PIXIapp;
            window.__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
                window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({
                    PIXI: PIXI,
                });
        }
    }
    SetState(stageName) {
        this.stateHandler.SetNextState(stageName);
    }
    GetRenderer() {
        return this.PIXIapp.renderer;
    }
}
export let ENGINE;
new Engine();
export let LOGGER;
export let PIXISTAGE;
export let MLT;
export let HEARTBEAT;
export let DISPLAYTICKER;
export let ROOTCONTAINER_GAME;
export let DEBUGSUPPORT;
export let UISUPPORT;
export let ASSETHANDLER;
export let EASINGSUPPORT;
export let PLATFORMSUPPORT;
export let COUNTRYCODESUPPORT;
export let SCREENMANAGER;
export let SHADERHANDLER;
export let SLOTMACHINE;
export let SOUNDMANAGER;
//# sourceMappingURL=Engine.js.map