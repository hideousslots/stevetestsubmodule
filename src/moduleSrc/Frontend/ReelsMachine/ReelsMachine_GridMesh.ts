/**
 * ReelsMachine_GridMesh
 *
 * Code to handle the grid mesh
 */

import * as PIXI from 'pixi.js';

import { SHADERHANDLER_SHADERS, SHADERHANDLER } from '../../exports';

export class ReelsMachine_GridMesh {
	public geometry: PIXI.Geometry;
	public buffer_Position: number[] = [];
	public buffer_UV: number[] = [];
	public buffer_BGUV: number[] = [];
	public buffer_DarkLight: number[] = [];
	public mesh: PIXI.Mesh<PIXI.Shader>;

	constructor() {}

	public CreateMeshFromGeometry(shaderID: string) {
		this.geometry = new PIXI.Geometry();
		this.geometry.addAttribute('aVertexPosition', this.buffer_Position, 2);
		this.geometry.addAttribute('aDarkLight', this.buffer_DarkLight, 2);
		this.geometry.addAttribute('aUvs', this.buffer_UV, 2);
		this.geometry.addAttribute('aBGUvs', this.buffer_BGUV, 2);

		this.mesh = new PIXI.Mesh(
			this.geometry,
			SHADERHANDLER.GetShader(shaderID),
		);
	}

	public Update() {
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
