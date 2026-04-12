import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture, shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

const ProjectMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: new THREE.Texture(),
    uHoverState: 0,
    uIntensity: 0.3,
    uMouse: new THREE.Vector2(0, 0),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform float uHoverState;
    uniform float uIntensity;
    uniform vec2 uMouse;
    
    varying vec2 vUv;

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      // Offset de UV para zoom e crop da textura se necessário. (simples aqui)
      vec2 uv = vUv;
      
      // Criar a distorção (Distorção Fluida)
      float noise = snoise(uv * 3.0 + uTime * 0.5) * uIntensity * uHoverState;
      vec2 distortedUv = uv + vec2(noise);
      
      // Extrair luminosidade para gerar um Depth Map "falso" em runtime
      vec4 baseTex = texture2D(uTexture, distortedUv);
      float depth = dot(baseTex.rgb, vec3(0.299, 0.587, 0.114));
      
      // Aplicar o deslocamento Falso 3D atrelado ao Mouse usando a luz como profundidade.
      vec2 parallaxUV = distortedUv + (uMouse * depth * 0.03 * uHoverState);
      
      // Transições com shaders: Efeito RGB Shift dependendo do uHoverState
      float rgbShift = uHoverState * 0.03;
      vec4 cr = texture2D(uTexture, parallaxUV + vec2(rgbShift, 0.0));
      vec4 cga = texture2D(uTexture, parallaxUV);
      vec4 cb = texture2D(uTexture, parallaxUV - vec2(rgbShift, 0.0));
      
      gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);
    }
  `
)

extend({ ProjectMaterial })

import type { Object3DNode } from '@react-three/fiber'

declare module '@react-three/fiber' {
  interface ThreeElements {
    projectMaterial: Object3DNode<any, typeof ProjectMaterial> & {
      uTexture?: THREE.Texture | null
      uTime?: number
      uHoverState?: number
      uIntensity?: number
      uMouse?: THREE.Vector2
      transparent?: boolean
    }
  }
}

interface ProjectShaderProps {
  textureUrl: string
  isHovered: boolean
}

export default function ProjectShader({ textureUrl, isHovered }: ProjectShaderProps) {
  const materialRef = useRef<any>(null)
  
  // get viewort for responsive sizing
  const { viewport } = useThree()

  // Utiliza useTexture do drei para carregar as imagens do Unsplash facilmente
  const texture = useTexture(textureUrl)

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uTime += delta
      
      // LERPing the hover state for smooth transition
      const targetHover = isHovered ? 1.0 : 0.0
      materialRef.current.uHoverState += (targetHover - materialRef.current.uHoverState) * 0.1
      
      // Update mouse position continuously based on state.pointer (which is normalized -1 to +1)
      materialRef.current.uMouse.x += (state.pointer.x - materialRef.current.uMouse.x) * 0.1
      materialRef.current.uMouse.y += (state.pointer.y - materialRef.current.uMouse.y) * 0.1
    }
  })

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <projectMaterial ref={materialRef} uTexture={texture} transparent />
    </mesh>
  )
}

