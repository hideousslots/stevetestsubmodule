/**
 * PIXISystemDebugContainer.ts
 *
 * Code to handle debug functions in a root container
 *
 * Some function exposed to application
 */
import * as PIXI from 'pixi.js';
import { PIXILimitsBox } from './PIXILimitsBox';
import { SCREENMANAGER } from '../Engine';
import { Screen_Orientation, } from '../ScreenHandling/ScreenManager';
import { PIXISystemRootContainer } from './PIXISystemRootContainer';
import { PIXISystemDebugButton } from './PIXISystemDebugButton';
import { UIBUTTONDEFINES } from '../UISupport/UIButtonDefines';
export class PIXISystemDebugContainer extends PIXISystemRootContainer {
    constructor(width, height, debugTextCount, debugButtonCount) {
        //Handle creation of the normal container
        super(width, height);
        this.debug_LandscapeLimits = [];
        this.debug_PortraitLimits = [];
        this.debug_Buttons = [];
        this.debug_Texts = [];
        //Set text
        this.debug_TextHolder = new PIXI.Container();
        this.addChild(this.debug_TextHolder);
        for (let i = 0; i < debugTextCount; i++) {
            const newText = new PIXI.Text('', {
                fontFamily: 'Arial',
                fontSize: 32,
                fill: 0xffffff,
                align: 'center',
            });
            this.debug_TextHolder.addChild(newText);
            newText.alpha = 0.75;
            newText.position.set(0, 48 * i);
            this.debug_Texts[i] = newText;
        }
        //Set debug buttons
        this.debug_ButtonHolder = new PIXI.Container();
        this.addChild(this.debug_ButtonHolder);
        const buttonColours = [0xff0000, 0x00ff00, 0x0000ff, 0x00ffff];
        for (let i = 0; i < debugButtonCount; i++) {
            const newButton = new PIXISystemDebugButton(i * 80, 0, 64, 64, buttonColours[i % buttonColours.length], UIBUTTONDEFINES.UIDEBUGBUTTON_X + i);
            newButton.alpha = 0.2;
            this.debug_ButtonHolder.addChild(newButton);
        }
    }
    //Public functions
    SetDebugText(index, value) {
        if (index < this.debug_Texts.length) {
            this.debug_Texts[index].text = value;
        }
    }
    AddDebugLimit(settings) {
        const UID = PIXISystemDebugContainer.debug_LimitNextUID++;
        this.AddDebugLimitsInternal(UID, settings.width, settings.height, settings.landscapeColour, settings.portraitColour, settings.alpha !== undefined ? settings.alpha : 1, settings.thickness !== undefined ? settings.thickness : 1, settings.centerX, settings.centerY);
        return UID;
    }
    RemoveDebugLimit(UID) {
        //Remove all limit boxes with the given UID
        let removeIndex = this.debug_LandscapeLimits.findIndex((existing) => {
            return existing.UID === UID;
        });
        if (removeIndex !== -1) {
            const remove = this.debug_LandscapeLimits.splice(removeIndex, 1)[0];
            this.removeChild(remove);
        }
        removeIndex = this.debug_PortraitLimits.findIndex((existing) => {
            return existing.UID === UID;
        });
        if (removeIndex !== -1) {
            const remove = this.debug_PortraitLimits.splice(removeIndex, 1)[0];
            this.removeChild(remove);
        }
    }
    //Internal handling
    AddDebugLimitsInternal(UID, width, height, landscapeColour, portraitColour, alpha, thickness, centerX, centerY) {
        const layoutData = SCREENMANAGER.GetScreenLayoutData();
        //Create (if needed) debug limits boxes
        const landscapeLimit = new PIXILimitsBox({
            UID: UID,
            centerX: centerX ? centerX : width / 2,
            centerY: centerY ? centerY : height / 2,
            width: width,
            height: height,
            lineWidth: thickness,
            colour: landscapeColour,
            alpha: alpha,
        });
        landscapeLimit.visible =
            layoutData.orientation === Screen_Orientation.Landscape;
        this.debug_LandscapeLimits.push(landscapeLimit);
        this.addChild(landscapeLimit);
        const portraitLimit = new PIXILimitsBox({
            UID: UID,
            centerX: centerY ? centerY : height / 2,
            centerY: centerX ? centerX : width / 2,
            width: height,
            height: width,
            lineWidth: thickness,
            colour: portraitColour,
            alpha: alpha,
        });
        portraitLimit.visible =
            layoutData.orientation === Screen_Orientation.Portrait;
        this.debug_PortraitLimits.push(portraitLimit);
        this.addChild(portraitLimit);
    }
    HandleResizeCallback(screenData) {
        super.HandleResizeCallback(screenData);
        //Reset debug lines
        if (this.debug_LandscapeLimits.length !== 0) {
            this.debug_LandscapeLimits.forEach((limit) => {
                limit.visible =
                    screenData.orientation === Screen_Orientation.Landscape;
            });
        }
        if (this.debug_PortraitLimits !== undefined) {
            this.debug_PortraitLimits.forEach((limit) => {
                limit.visible =
                    screenData.orientation === Screen_Orientation.Portrait;
            });
        }
        //Adjust the bounds for the text to occupy the extra spaces too
        this.debug_TextHolder.position.set(-screenData.offsetX, -screenData.offsetY);
        this.debug_ButtonHolder.position.set(-screenData.offsetX / 2 + screenData.centerX, -screenData.offsetY);
    }
}
PIXISystemDebugContainer.debug_LimitNextUID = 0;
//# sourceMappingURL=PIXISystemDebugContainer.js.map