import { Spine } from 'pixi-spine';
export class PIXISpine extends Spine {
    constructor(_json) {
        super(_json.spineData);
    }
    SetSkin(name) {
        this.skeleton.setSkinByName(name);
        this.skeleton.setToSetupPose();
    }
    SetAnimation(name, loop) {
        this.state.setAnimation(0, name, loop);
    }
}
//# sourceMappingURL=PIXISpine.js.map