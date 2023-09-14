/**
 * ReelsMachine_GridMesh
 *
 * Code to handle the grid mesh
 */
import * as PIXI from 'pixi.js';
import { SHADERHANDLER } from '../../exports';
export class ReelsMachine_GridMesh {
    constructor() {
        this.buffer_Position = [];
        this.buffer_UV = [];
        this.buffer_BGUV = [];
        this.buffer_DarkLight = [];
    }
    CreateMeshFromGeometry(shaderID) {
        this.geometry = new PIXI.Geometry();
        this.geometry.addAttribute('aVertexPosition', this.buffer_Position, 2);
        this.geometry.addAttribute('aDarkLight', this.buffer_DarkLight, 2);
        this.geometry.addAttribute('aUvs', this.buffer_UV, 2);
        this.geometry.addAttribute('aBGUvs', this.buffer_BGUV, 2);
        this.mesh = new PIXI.Mesh(this.geometry, SHADERHANDLER.GetShader(shaderID));
    }
    Update() {
        const posForUpdate = this.mesh.geometry.getBuffer('aVertexPosition');
        const UVForUpdate = this.mesh.geometry.getBuffer('aUvs');
        const BGUVForUpdate = this.mesh.geometry.getBuffer('aBGUvs');
        const RGBForUpdate = this.mesh.geometry.getBuffer('aDarkLight');
        posForUpdate.update(this.buffer_Position);
        UVForUpdate.update(this.buffer_UV);
        BGUVForUpdate.update(this.buffer_BGUV);
        RGBForUpdate.update(this.buffer_DarkLight);
        this.mesh.blendMode = PIXI.BLEND_MODES.NORMAL;
    }
}
//# sourceMappingURL=ReelsMachine_GridMesh.js.map