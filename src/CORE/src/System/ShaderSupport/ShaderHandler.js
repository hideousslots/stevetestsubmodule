/**
 * ShaderHandler.ts
 *
 * Central area to build (and remove shader + texture linkups)
 */
import * as PIXI from 'pixi.js';
import { Shader_VertexRGBUV } from './Shader_VertexRGBUV';
import { Shader_ReelTest } from './Shader_ReelTest';
export var SHADERHANDLER_SHADERS;
(function (SHADERHANDLER_SHADERS) {
    SHADERHANDLER_SHADERS["VERTEXRGBUV"] = "VertexRGBUV";
    SHADERHANDLER_SHADERS["REELTEST"] = "Shader_ReelTest";
})(SHADERHANDLER_SHADERS || (SHADERHANDLER_SHADERS = {}));
const ShaderSources = {
    VertexRGBUV: Shader_VertexRGBUV,
    Shader_ReelTest: Shader_ReelTest,
};
export class ShaderHandler {
    constructor() {
        this.availableShaders = {};
    }
    MakeShader(ID, baseShader, uniforms) {
        //Create the shader, if not already made
        if (this.availableShaders[ID] === undefined) {
            //Find source
            if (ShaderSources[baseShader] === undefined) {
                return undefined;
            }
            //Create new one
            this.availableShaders[ID] = {
                shader: PIXI.Shader.from(ShaderSources[baseShader].program_vertex, ShaderSources[baseShader].program_fragment, uniforms),
            };
        }
        return this.availableShaders[ID].shader;
    }
    GetShader(ID) {
        return this.availableShaders[ID].shader;
    }
}
//# sourceMappingURL=ShaderHandler.js.map