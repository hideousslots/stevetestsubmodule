/**
 * Shader_ReelTest.ts
 *
 * Shader program for testing reel shader
 */
export const Shader_ReelTest = {
    program_vertex: `
    precision mediump float;

    attribute vec2 aVertexPosition;
    attribute vec2 aDarkLight;
    attribute vec2 aUvs;
    attribute vec2 aBGUvs;

    uniform mat3 translationMatrix;
    uniform mat3 projectionMatrix;

    varying vec2 vUvs;
    varying vec2 vBGUvs;
    varying vec2 vDarkLight;

    void main() {

        vUvs = aUvs;
        vBGUvs = aBGUvs;
        vDarkLight = aDarkLight;
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    }`,
    program_fragment: `
    precision mediump float;

    varying vec2 vDarkLight;
    varying vec2 vUvs;
    varying vec2 vBGUvs;

    uniform sampler2D uSampler2;
    uniform float uAlpha;
    uniform vec3 uAdditiveColour;

    void main() {
        //vRGB holds...
        //R - original colour multiplier
        //G - additional RGB power (against uniform light colour)
        vec4 bgTex = texture2D(uSampler2, vBGUvs);
        vec4 symTex = texture2D(uSampler2, vUvs);
        vec4 frag = vec4(bgTex[0] * (1.0-symTex[3]) + (symTex[0] * symTex[3]),
         bgTex[1] * (1.0-symTex[3]) + (symTex[1] * symTex[3]),
         bgTex[2] * (1.0-symTex[3]) + (symTex[2] * symTex[3]),
         1);
        gl_FragColor = ((frag * vec4(vDarkLight[0],vDarkLight[0],vDarkLight[0],1.0)) +
        (vec4(vDarkLight[1] * uAdditiveColour[0],vDarkLight[1] * uAdditiveColour[1],vDarkLight[1] * uAdditiveColour[2],0))) * vec4(1,1,1,uAlpha);
        ;
    }`,
};
//# sourceMappingURL=Shader_ReelTest.js.map