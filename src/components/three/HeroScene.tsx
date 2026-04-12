import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

function ParticleSphere() {
  const meshRef = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  const count = 1500
  const { positions, originalPositions } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const originalPositions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2.0 + (Math.random() - 0.5) * 0.3
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      originalPositions[i * 3] = x
      originalPositions[i * 3 + 1] = y
      originalPositions[i * 3 + 2] = z
    }
    return { positions, originalPositions }
  }, [])

  const sizes = useMemo(() => {
    const s = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      s[i] = Math.random() * 3 + 1
    }
    return s
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const geo = meshRef.current.geometry
    const pos = geo.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const ox = originalPositions[i3]
      const oy = originalPositions[i3 + 1]
      const oz = originalPositions[i3 + 2]

      // Breathing effect
      const breathe = Math.sin(t * 0.5 + i * 0.01) * 0.08
      // Wave distortion
      const wave = Math.sin(t * 0.8 + ox * 2) * 0.05

      pos[i3] = ox * (1 + breathe) + wave
      pos[i3 + 1] = oy * (1 + breathe) + Math.sin(t * 0.6 + oz * 2) * 0.05
      pos[i3 + 2] = oz * (1 + breathe)
    }
    geo.attributes.position.needsUpdate = true

    meshRef.current.rotation.y = t * 0.05
    meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.1
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#99CD85"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function FloatingRing({ radius = 2.8, tube = 0.005 }: { radius?: number; tube?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    meshRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.2
    meshRef.current.rotation.z = t * 0.1
  })

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[radius, tube, 32, 128]} />
      <meshBasicMaterial color="#63783D" transparent opacity={0.25} />
    </mesh>
  )
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <ParticleSphere />
        <FloatingRing />
        <FloatingRing radius={3.2} tube={0.003} />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            intensity={1.5}
            mipmapBlur
          />

        </EffectComposer>
      </Canvas>
    </div>
  )
}
