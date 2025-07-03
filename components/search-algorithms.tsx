"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SearchAlgorithms() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const cubesRef = useRef<THREE.Mesh[]>([])
  const [arrayData, setArrayData] = useState([10, 23, 35, 47, 52, 68, 74, 81, 95])
  const [searchValue, setSearchValue] = useState("")
  const [algorithm, setAlgorithm] = useState<"linear" | "binary">("linear")
  const [isAnimating, setIsAnimating] = useState(false)
  const [searchResult, setSearchResult] = useState<{ found: boolean; index: number; steps: number } | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf8fafc)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 800 / 400, 0.1, 1000)
    camera.position.set(0, 5, 12)
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

    const directionalLight = new THREE.DirectionalLight(0xeab308, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

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
      const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2)
      const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0xeab308),
      })
      const cube = new THREE.Mesh(geometry, material)

      cube.position.x = (index - arrayData.length / 2) * 1.8
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
      context.fillStyle = "#a16207"
      context.font = "24px Arial"
      context.textAlign = "center"
      context.fillText(value.toString(), 64, 60)
      context.fillText(`[${index}]`, 64, 90)

      const texture = new THREE.CanvasTexture(canvas)
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture })
      const sprite = new THREE.Sprite(spriteMaterial)
      sprite.position.copy(cube.position)
      sprite.position.y += 1.5
      sprite.scale.set(1.2, 1.2, 1)
      sceneRef.current!.add(sprite)
    })
  }

  const animateLinearSearch = async (target: number) => {
    let steps = 0
    let found = false
    let foundIndex = -1

    for (let i = 0; i < arrayData.length; i++) {
      steps++
      const cube = cubesRef.current[i]
      const originalColor = (cube.material as THREE.MeshLambertMaterial).color.clone()

      // Highlight current element
      ;(cube.material as THREE.MeshLambertMaterial).color = new THREE.Color(0xef4444)

      // Animate examination
      await new Promise<void>((resolve) => {
        const startY = cube.position.y
        const duration = 600
        const startTime = Date.now()

        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          const bounce = Math.sin(progress * Math.PI)

          cube.position.y = startY + bounce * 0.8

          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            cube.position.y = startY
            resolve()
          }
        }
        animate()
      })

      if (arrayData[i] === target) {
        found = true
        foundIndex = i
        ;(cube.material as THREE.MeshLambertMaterial).color = new THREE.Color(0x22c55e)
        break
      } else {
        ;(cube.material as THREE.MeshLambertMaterial).color = new THREE.Color(0x6b7280)
      }

      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    return { found, index: foundIndex, steps }
  }

  const animateBinarySearch = async (target: number) => {
    let steps = 0
    let found = false
    let foundIndex = -1
    let left = 0
    let right = arrayData.length - 1

    // Reset all colors
    cubesRef.current.forEach((cube) => {
      ;(cube.material as THREE.MeshLambertMaterial).color = new THREE.Color(0xeab308)
    })

    while (left <= right) {
      steps++
      const mid = Math.floor((left + right) / 2)
      const cube = cubesRef.current[mid]

      // Highlight search range
      for (let i = left; i <= right; i++) {
        if (i !== mid) {
          ;(cubesRef.current[i].material as THREE.MeshLambertMaterial).color = new THREE.Color(0xfbbf24)
        }
      }
      // Highlight middle element
      ;(cube.material as THREE.MeshLambertMaterial).color = new THREE.Color(0xef4444)

      // Animate examination
      await new Promise<void>((resolve) => {
        const startY = cube.position.y
        const duration = 800
        const startTime = Date.now()

        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          const bounce = Math.sin(progress * Math.PI)

          cube.position.y = startY + bounce * 1.2

          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            cube.position.y = startY
            resolve()
          }
        }
        animate()
      })

      if (arrayData[mid] === target) {
        found = true
        foundIndex = mid
        ;(cube.material as THREE.MeshLambertMaterial).color = new THREE.Color(0x22c55e)
        break
      } else if (arrayData[mid] < target) {
        // Eliminate left half
        for (let i = left; i <= mid; i++) {
          ;(cubesRef.current[i].material as THREE.MeshLambertMaterial).color = new THREE.Color(0x6b7280)
        }
        left = mid + 1
      } else {
        // Eliminate right half
        for (let i = mid; i <= right; i++) {
          ;(cubesRef.current[i].material as THREE.MeshLambertMaterial).color = new THREE.Color(0x6b7280)
        }
        right = mid - 1
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    return { found, index: foundIndex, steps }
  }

  const handleSearch = async () => {
    const target = Number.parseInt(searchValue)
    if (isNaN(target) || isAnimating) return

    setIsAnimating(true)
    setSearchResult(null)

    // Reset colors
    cubesRef.current.forEach((cube) => {
      ;(cube.material as THREE.MeshLambertMaterial).color = new THREE.Color(0xeab308)
    })

    let result
    if (algorithm === "linear") {
      result = await animateLinearSearch(target)
    } else {
      result = await animateBinarySearch(target)
    }

    setSearchResult(result)
    setIsAnimating(false)
  }

  const resetVisualization = () => {
    cubesRef.current.forEach((cube) => {
      ;(cube.material as THREE.MeshLambertMaterial).color = new THREE.Color(0xeab308)
    })
    setSearchResult(null)
  }

  useEffect(() => {
    createArrayVisualization()
  }, [arrayData])

  return (
    <div className="space-y-4">
      <div ref={mountRef} className="w-full flex justify-center" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="searchValue">Search Value</Label>
          <Input
            id="searchValue"
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Enter value"
          />
        </div>

        <div className="space-y-2">
          <Label>Algorithm</Label>
          <Select value={algorithm} onValueChange={(value: "linear" | "binary") => setAlgorithm(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linear">Linear Search</SelectItem>
              <SelectItem value="binary">Binary Search</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Search</Label>
          <Button onClick={handleSearch} disabled={isAnimating} className="w-full">
            {isAnimating ? "Searching..." : "Start Search"}
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Reset</Label>
          <Button onClick={resetVisualization} className="w-full bg-transparent" variant="outline">
            Reset
          </Button>
        </div>
      </div>

      {searchResult && (
        <div
          className={`p-4 rounded-lg border ${searchResult.found ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
        >
          <h3 className="font-semibold mb-2">Search Result:</h3>
          <div className="space-y-1 text-sm">
            <p>Target: {searchValue}</p>
            <p>Found: {searchResult.found ? "Yes" : "No"}</p>
            {searchResult.found && <p>Index: {searchResult.index}</p>}
            <p>Steps: {searchResult.steps}</p>
            <p>Algorithm: {algorithm === "linear" ? "Linear Search" : "Binary Search"}</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-semibold mb-2 text-yellow-900">Linear Search</h3>
          <ul className="text-sm space-y-1 text-yellow-800">
            <li>• Time Complexity: O(n)</li>
            <li>• Space Complexity: O(1)</li>
            <li>• Works on unsorted arrays</li>
            <li>• Checks each element sequentially</li>
            <li>• Best case: O(1), Worst case: O(n)</li>
          </ul>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-semibold mb-2 text-yellow-900">Binary Search</h3>
          <ul className="text-sm space-y-1 text-yellow-800">
            <li>• Time Complexity: O(log n)</li>
            <li>• Space Complexity: O(1)</li>
            <li>• Requires sorted array</li>
            <li>• Divides search space in half each step</li>
            <li>• Much faster for large datasets</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
