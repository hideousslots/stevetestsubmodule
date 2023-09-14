/**
 * Shader_VertexRGBUV.ts
 *
 * Shader program for Vertex with RGB with UV
 */
export const Shader_VertexRGBUV = {
    program_vertex: `
    precision mediump float;

    attribute vec2 aVertexPosition;
    attribute vec3 aRGB;
    attribute vec2 aUvs;

    uniform mat3 translationMatrix;
    uniform mat3 projectionMatrix;

    varying vec2 vUvs;
    varying vec3 vRGB;

    void main() {

        vUvs = aUvs;
        vRGB = aRGB;
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    }`,
    program_fragment: `
    precision mediump float;

    varying vec3 vRGB;
    varying vec2 vUvs;

    uniform sampler2D uSampler2;
    uniform float uAlpha;

    void main() {
        gl_FragColor = (texture2D(uSampler2, vUvs) * vec4(vRGB, uAlpha));
    }`,
};
//# sourceMappingURL=Shader_VertexRGBUV.js.map