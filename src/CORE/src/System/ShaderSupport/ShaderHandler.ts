/**
 * ShaderHandler.ts
 *
 * Central area to build (and remove shader + texture linkups)
 */

import * as PIXI from 'pixi.js';

export interface ShaderHandler_Program {
	program_vertex: any;
	program_fragment: any;
}

import { Shader_VertexRGBUV } from './Shader_VertexRGBUV';
import { Shader_ReelTest } from './Shader_ReelTest';

export enum SHADERHANDLER_SHADERS {
	VERTEXRGBUV = 'VertexRGBUV',
	REELTEST = 'Shader_ReelTest',
}

const ShaderSources: {
	[key: string]: ShaderHandler_Program;
} = {
	VertexRGBUV: Shader_VertexRGBUV,
	Shader_ReelTest: Shader_ReelTest,
};

export class ShaderHandler {
	protected availableShaders: {
		[key: string]: { shader: PIXI.Shader };
	} = {};

	constructor() {}

	public MakeShader(
		ID: string,
		baseShader: string,
		uniforms: any,
	): PIXI.Shader | undefined {
		//Create the shader, if not already made

		if (this.availableShaders[ID] === undefined) {
			//Find source

			if (ShaderSources[baseShader] === undefined) {
				return undefined;
			}

			//Create new one

			this.availableShaders[ID] = {
				shader: PIXI.Shader.from(
					ShaderSources[baseShader].program_vertex,
					ShaderSources[baseShader].program_fragment,
					uniforms,
				),
			};
		}

		return this.availableShaders[ID].shader;
	}

	public GetShader(ID: string): PIXI.Shader {
		return this.availableShaders[ID].shader;
	}
}
