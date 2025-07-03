"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ArrayVisualization() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const cubesRef = useRef<THREE.Mesh[]>([])
  const [arrayData, setArrayData] = useState([10, 25, 30, 45, 50])
  const [newValue, setNewValue] = useState("")
  const [accessIndex, setAccessIndex] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf8fafc)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 800 / 400, 0.1, 1000)
    camera.position.set(0, 5, 10)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(800, 400)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0x3b82f6, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(20, 10)
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -2
    ground.receiveShadow = true
    scene.add(ground)

    mountRef.current.appendChild(renderer.domElement)

    // Create initial array
    createArrayVisualization()

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  const createArrayVisualization = () => {
    if (!sceneRef.current) return

    // Clear existing cubes
    cubesRef.current.forEach((cube) => {
      sceneRef.current!.remove(cube)
    })
    cubesRef.current = []

    // Create new cubes for array elements
    arrayData.forEach((value, index) => {
      const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)
      const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0x3b82f6),
      })
      const cube = new THREE.Mesh(geometry, material)

      cube.position.x = (index - arrayData.length / 2) * 2
      cube.position.y = 0
      cube.castShadow = true
      cube.receiveShadow = true

      sceneRef.current!.add(cube)
      cubesRef.current.push(cube)

      // Add text label
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")!
      canvas.width = 128
      canvas.height = 128
      context.fillStyle = "white"
      context.fillRect(0, 0, 128, 128)
      context.fillStyle = "#1e40af"
      context.font = "32px Arial"
      context.textAlign = "center"
      context.fillText(value.toString(), 64, 70)
      context.fillText(`[${index}]`, 64, 100)

      const texture = new THREE.CanvasTexture(canvas)
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture })
      const sprite = new THREE.Sprite(spriteMaterial)
      sprite.position.copy(cube.position)
      sprite.position.y += 1.5
      sprite.scale.set(1, 1, 1)
      sceneRef.current!.add(sprite)
    })
  }

  const animateAccess = async (index: number) => {
    if (index < 0 || index >= cubesRef.current.length || isAnimating) return

    setIsAnimating(true)
    const cube = cubesRef.current[index]
    const originalY = cube.position.y
    const originalColor = (cube.material as THREE.MeshLambertMaterial).color.clone()

    // Highlight and lift the accessed element
    const highlightColor = new THREE.Color(0xef4444)
    ;(cube.material as THREE.MeshLambertMaterial).color = highlightColor

    // Animate upward movement
    const animateUp = () => {
      return new Promise<void>((resolve) => {
        const startY = originalY
        const endY = originalY + 1
        const duration = 500
        const startTime = Date.now()

        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          const easeProgress = 1 - Math.pow(1 - progress, 3)

          cube.position.y = startY + (endY - startY) * easeProgress

          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            resolve()
          }
        }
        animate()
      })
    }

    // Animate downward movement
    const animateDown = () => {
      return new Promise<void>((resolve) => {
        const startY = cube.position.y
        const endY = originalY
        const duration = 500
        const startTime = Date.now()

        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          const easeProgress = 1 - Math.pow(1 - progress, 3)

          cube.position.y = startY + (endY - startY) * easeProgress

          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            resolve()
          }
        }
        animate()
      })
    }

    await animateUp()
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await animateDown()

    // Restore original color
    ;(cube.material as THREE.MeshLambertMaterial).color = originalColor
    setIsAnimating(false)
  }

  const handleAddElement = () => {
    if (newValue && !isAnimating) {
      const value = Number.parseInt(newValue)
      if (!isNaN(value)) {
        setArrayData([...arrayData, value])
        setNewValue("")
      }
    }
  }

  const handleAccessElement = () => {
    const index = Number.parseInt(accessIndex)
    if (!isNaN(index)) {
      animateAccess(index)
    }
  }

  const handleRemoveElement = () => {
    if (arrayData.length > 0 && !isAnimating) {
      setArrayData(arrayData.slice(0, -1))
    }
  }

  useEffect(() => {
    createArrayVisualization()
  }, [arrayData])

  return (
    <div className="space-y-4">
      <div ref={mountRef} className="w-full flex justify-center" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="newValue">Add Element</Label>
          <div className="flex gap-2">
            <Input
              id="newValue"
              type="number"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Enter value"
            />
            <Button onClick={handleAddElement} disabled={isAnimating}>
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accessIndex">Access by Index</Label>
          <div className="flex gap-2">
            <Input
              id="accessIndex"
              type="number"
              value={accessIndex}
              onChange={(e) => setAccessIndex(e.target.value)}
              placeholder="Enter index"
              min="0"
              max={arrayData.length - 1}
            />
            <Button onClick={handleAccessElement} disabled={isAnimating}>
              Access
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Remove Element</Label>
          <Button onClick={handleRemoveElement} disabled={isAnimating || arrayData.length === 0} className="w-full">
            Remove Last
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold mb-2 text-blue-900">Array Characteristics:</h3>
        <ul className="text-sm space-y-1 text-blue-800">
          <li>• Elements are stored in contiguous memory locations</li>
          <li>• Direct access to any element using index: O(1)</li>
          <li>• Fixed size in most implementations</li>
          <li>• Cache-friendly due to memory locality</li>
        </ul>
      </div>
    </div>
  )
}
