import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Icosahedron, MeshDistortMaterial } from '@react-three/drei'
import gsap from 'gsap'

export default function ManifestoObject() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<any>(null)
  
  const scrollData = useRef({
    velocity: 0,
    progress: 0,
    lastY: 0
  })

  useEffect(() => {
    // Capture global scroll to add velocity and distortion
    const handleScroll = () => {
      const currentY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      
      const velocity = Math.abs(currentY - scrollData.current.lastY)
      scrollData.current.velocity = Math.min(velocity * 0.05, 2)
      scrollData.current.progress = currentY / docHeight
      
      scrollData.current.lastY = currentY

      // Return velocity to 0 smoothly using GSAP
      gsap.to(scrollData.current, {
        velocity: 0,
        duration: 1,
        ease: 'power2.out'
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return

    // Base continuous rotation
    meshRef.current.rotation.x += delta * 0.2
    meshRef.current.rotation.y += delta * 0.3

    // Add scroll velocity to rotation for interactive feel
    meshRef.current.rotation.y += scrollData.current.velocity * delta * 10
    
    // Distort geometry based on scroll progress and velocity
    const targetDistortion = 0.3 + scrollData.current.progress * 0.5 + scrollData.current.velocity * 0.3
    materialRef.current.distort += (targetDistortion - materialRef.current.distort) * 0.1
    
    // Change speed of distortion slightly with scroll
    materialRef.current.speed = 2 + scrollData.current.velocity * 5
  })

  return (
    <group>
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 10]} intensity={2} color="#C4A35A" />
      <directionalLight position={[-10, -10, -10]} intensity={1} color="#7FA653" />
      
      <Icosahedron ref={meshRef} args={[2.5, 64]}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#0f160f"
          roughness={0.2}
          metalness={0.9}
          distort={0.4}
          speed={2}
          envMapIntensity={1}
          wireframe={true}
        />
      </Icosahedron>
    </group>
  )
}
