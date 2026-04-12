import { useEffect, useRef } from 'react'

interface Cube {
  x: number
  y: number
  z: number
  size: number
  rotX: number
  rotY: number
  rotZ: number
  spinX: number
  spinY: number
  spinZ: number
  opacity: number
  baseOpacity: number
  vx: number
  vy: number
  spawnY: number // the scroll position that triggers this cube
  color: number // index into palette
  active: boolean
}

const COLORS = [
  [127, 166, 83],   // primary green
  [153, 205, 133],  // primary light
  [99, 120, 61],    // primary dark
  [196, 163, 90],   // accent warm
  [138, 154, 108],  // accent sage
  [184, 147, 74],   // accent amber
]

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let w = window.innerWidth
    let h = window.innerHeight
    const mouse = { x: -9999, y: -9999, radius: 150 }
    let scrollProgress = 0
    let maxScroll = 1

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w
      canvas.height = h
      maxScroll = Math.max(document.documentElement.scrollHeight - h, 1)
    }
    resize()

    // Pre-generate cubes spread across the whole page scroll
    const totalCubes = Math.min(Math.floor(w / 10), 90)
    const cubes: Cube[] = []

    for (let i = 0; i < totalCubes; i++) {
      const spawnY = (i / totalCubes) * maxScroll
      cubes.push({
        x: Math.random() * w,
        y: h + 50 + Math.random() * 200, // start below screen
        z: Math.random() * 150 - 75,
        size: Math.random() * 5 + 3,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        spinX: (Math.random() - 0.5) * 0.012,
        spinY: (Math.random() - 0.5) * 0.012,
        spinZ: (Math.random() - 0.5) * 0.008,
        opacity: 0,
        baseOpacity: Math.random() * 0.25 + 0.1,
        vx: 0,
        vy: -(Math.random() * 0.35 + 0.1), // float up
        spawnY,
        color: Math.floor(Math.random() * COLORS.length),
        active: false,
      })
    }

    // Project a 3D point to 2D with perspective (aspect-corrected)
    const focalLength = 500
    const project = (x: number, y: number, z: number) => {
      const scale = focalLength / (focalLength + z)
      return {
        x: x * scale + w / 2,
        y: y * scale + h / 2,
        scale,
      }
    }

    // Rotate a 3D point around X, Y, Z axes
    const rotate3D = (
      px: number,
      py: number,
      pz: number,
      rx: number,
      ry: number,
      rz: number
    ) => {
      // Rotate X
      let y1 = py * Math.cos(rx) - pz * Math.sin(rx)
      let z1 = py * Math.sin(rx) + pz * Math.cos(rx)

      // Rotate Y
      let x2 = px * Math.cos(ry) + z1 * Math.sin(ry)
      let z2 = -px * Math.sin(ry) + z1 * Math.cos(ry)

      // Rotate Z
      let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz)
      let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz)

      return { x: x3, y: y3, z: z2 }
    }

    // Draw a single 3D cube
    const drawCube = (cube: Cube) => {
      const s = cube.size / 2
      // 8 vertices of a cube
      const vertices = [
        [-s, -s, -s],
        [s, -s, -s],
        [s, s, -s],
        [-s, s, -s],
        [-s, -s, s],
        [s, -s, s],
        [s, s, s],
        [-s, s, s],
      ]

      // Rotate and project each vertex
      const projected = vertices.map(([vx, vy, vz]) => {
        const r = rotate3D(vx, vy, vz, cube.rotX, cube.rotY, cube.rotZ)
        return project(
          cube.x - w / 2 + r.x,
          cube.y - h / 2 + r.y,
          cube.z + r.z
        )
      })

      // 6 faces (indices into vertices)
      const faces = [
        [0, 1, 2, 3], // back
        [4, 5, 6, 7], // front
        [0, 1, 5, 4], // top
        [2, 3, 7, 6], // bottom
        [0, 3, 7, 4], // left
        [1, 2, 6, 5], // right
      ]

      // Light direction for basic shading
      const lightFactors = [0.6, 1.0, 0.7, 0.5, 0.65, 0.85]

      const col = COLORS[cube.color]

      // Sort faces by average Z (painter's algorithm)
      const facesWithZ = faces.map((face, fi) => {
        const avgZ = face.reduce((sum, vi) => {
          const r = rotate3D(
            vertices[vi][0],
            vertices[vi][1],
            vertices[vi][2],
            cube.rotX,
            cube.rotY,
            cube.rotZ
          )
          return sum + r.z
        }, 0) / 4
        return { face, fi, avgZ }
      })
      facesWithZ.sort((a, b) => a.avgZ - b.avgZ)

      for (const { face, fi } of facesWithZ) {
        const pts = face.map((vi) => projected[vi])
        const light = lightFactors[fi]

        ctx!.beginPath()
        ctx!.moveTo(pts[0].x, pts[0].y)
        for (let i = 1; i < pts.length; i++) {
          ctx!.lineTo(pts[i].x, pts[i].y)
        }
        ctx!.closePath()

        const r = Math.round(col[0] * light)
        const g = Math.round(col[1] * light)
        const b = Math.round(col[2] * light)
        ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${cube.opacity * 0.7})`
        ctx!.fill()

        ctx!.strokeStyle = `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${cube.opacity * 0.3})`
        ctx!.lineWidth = 0.5
        ctx!.stroke()
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleScroll = () => {
      scrollProgress = window.scrollY / maxScroll
    }

    const animate = () => {
      ctx!.clearRect(0, 0, w, h)

      const currentScroll = window.scrollY
      // Global opacity based on scroll — at scroll=0, cubes are almost invisible
      const scrollFactor = Math.min(currentScroll / (h * 0.5), 1)

      for (const cube of cubes) {
        // Activate cube when scroll passes its spawn point (first few activate very early for "just a hint")
        const earlyThreshold = cube.spawnY < h * 0.3 ? h * 0.05 : h * 0.5
        if (!cube.active && currentScroll >= cube.spawnY - earlyThreshold) {
          cube.active = true
          cube.x = Math.random() * w
          cube.y = h + 30 + Math.random() * 100
        }

        if (!cube.active) continue

        // Float upward
        cube.y += cube.vy

        // Spin
        cube.rotX += cube.spinX
        cube.rotY += cube.spinY
        cube.rotZ += cube.spinZ

        // Fade in (modulated by scroll)
        const targetOp = cube.baseOpacity * scrollFactor
        cube.opacity += (targetOp - cube.opacity) * 0.03

        // Mouse push interaction
        const dx = cube.x - mouse.x
        const dy = cube.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < mouse.radius) {
          const force = ((mouse.radius - dist) / mouse.radius) * 4
          const angle = Math.atan2(dy, dx)
          cube.vx += Math.cos(angle) * force * 0.3
          // Also add spin on push
          cube.spinX += (Math.random() - 0.5) * 0.005
          cube.spinY += (Math.random() - 0.5) * 0.005
          cube.opacity = Math.min(cube.opacity + 0.05, 0.5)
        }

        // Apply velocity
        cube.x += cube.vx
        // Friction on horizontal movement
        cube.vx *= 0.96

        // If cube leaves top, respawn at bottom if scroll is sufficient
        if (cube.y < -60) {
          cube.y = h + 30 + Math.random() * 100
          cube.x = Math.random() * w
          cube.vx = 0
          cube.opacity = 0
        }

        // Wrap horizontal
        if (cube.x < -60) cube.x = w + 30
        if (cube.x > w + 60) cube.x = -30

        drawCube(cube)
      }

      animationId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', resize, { passive: true })
    handleScroll()
    animate()

    // Use ResizeObserver instead of polling interval
    const ro = new ResizeObserver(() => {
      const newMax = Math.max(document.documentElement.scrollHeight - h, 1)
      if (Math.abs(newMax - maxScroll) > 100) maxScroll = newMax
    })
    ro.observe(document.documentElement)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', resize)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
