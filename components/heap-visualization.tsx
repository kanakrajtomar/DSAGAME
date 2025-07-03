"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function HeapVisualization() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const nodesRef = useRef<THREE.Group[]>([])
  const edgesRef = useRef<THREE.Group[]>([])
  const [heapArray, setHeapArray] = useState([90, 80, 70, 60, 50, 40, 30])
  const [newValue, setNewValue] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [heapType, setHeapType] = useState<"max" | "min">("max")

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf8fafc)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 800 / 500, 0.1, 1000)
    camera.position.set(0, 8, 12)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(800, 500)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xf97316, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    mountRef.current.appendChild(renderer.domElement)

    // Create initial heap
    createHeapVisualization()

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

  const getNodePosition = (index: number): { x: number; y: number } => {
    const level = Math.floor(Math.log2(index + 1))
    const positionInLevel = index - (Math.pow(2, level) - 1)
    const maxNodesInLevel = Math.pow(2, level)
    const spacing = 8 / Math.max(maxNodesInLevel, 1)

    const x = (positionInLevel - (maxNodesInLevel - 1) / 2) * spacing
    const y = 4 - level * 2.5

    return { x, y }
  }

  const createHeapVisualization = () => {
    if (!sceneRef.current) return

    // Clear existing nodes and edges
    nodesRef.current.forEach((node) => sceneRef.current!.remove(node))
    edgesRef.current.forEach((edge) => sceneRef.current!.remove(edge))
    nodesRef.current = []
    edgesRef.current = []

    // Create nodes
    heapArray.forEach((value, index) => {
      const { x, y } = getNodePosition(index)

      // Create node group
      const nodeGroup = new THREE.Group()

      // Create octahedron for heap node (different from tree spheres)
      const geometry = new THREE.OctahedronGeometry(0.8)
      const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0xf97316),
        transparent: true,
        opacity: 0.9,
      })
      const octahedron = new THREE.Mesh(geometry, material)
      octahedron.castShadow = true
      octahedron.receiveShadow = true
      nodeGroup.add(octahedron)

      nodeGroup.position.set(x, y, 0)
      sceneRef.current.add(nodeGroup)
      nodesRef.current.push(nodeGroup)

      // Add value label
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")!
      canvas.width = 128
      canvas.height = 64
      context.fillStyle = "white"
      context.fillRect(0, 0, 128, 64)
      context.fillStyle = "#9a3412"
      context.font = "bold 28px Arial"
      context.textAlign = "center"
      context.fillText(value.toString(), 64, 42)

      const texture = new THREE.CanvasTexture(canvas)
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture })
      const sprite = new THREE.Sprite(spriteMaterial)
      sprite.position.set(x, y + 1.2, 0)
      sprite.scale.set(1.2, 0.6, 1)
      sceneRef.current.add(sprite)

      // Create edge to parent
      if (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2)
        const parentPos = getNodePosition(parentIndex)
        createEdge({ x, y }, parentPos)
      }
    })
  }

  const createEdge = (childPos: { x: number; y: number }, parentPos: { x: number; y: number }) => {
    if (!sceneRef.current) return

    const edgeGroup = new THREE.Group()
    const start = new THREE.Vector3(parentPos.x, parentPos.y, 0)
    const end = new THREE.Vector3(childPos.x, childPos.y, 0)
    const direction = end.clone().sub(start)
    const length = direction.length()

    const geometry = new THREE.CylinderGeometry(0.05, 0.05, length)
    const material = new THREE.MeshLambertMaterial({ color: 0x6b7280 })
    const cylinder = new THREE.Mesh(geometry, material)

    cylinder.position.copy(start.clone().add(end).multiplyScalar(0.5))
    cylinder.lookAt(end)
    cylinder.rotateX(Math.PI / 2)

    edgeGroup.add(cylinder)
    sceneRef.current.add(edgeGroup)
    edgesRef.current.push(edgeGroup)
  }

  const heapifyUp = async (index: number) => {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2)
      const shouldSwap =
        heapType === "max" ? heapArray[index] > heapArray[parentIndex] : heapArray[index] < heapArray[parentIndex]

      if (!shouldSwap) break

      // Animate swap
      await animateSwap(index, parentIndex)

      // Perform swap
      const temp = heapArray[index]
      heapArray[index] = heapArray[parentIndex]
      heapArray[parentIndex] = temp

      index = parentIndex
    }
  }

  const heapifyDown = async (index: number) => {
    const length = heapArray.length

    while (true) {
      let targetIndex = index
      const leftChild = 2 * index + 1
      const rightChild = 2 * index + 2

      if (heapType === "max") {
        if (leftChild < length && heapArray[leftChild] > heapArray[targetIndex]) {
          targetIndex = leftChild
        }
        if (rightChild < length && heapArray[rightChild] > heapArray[targetIndex]) {
          targetIndex = rightChild
        }
      } else {
        if (leftChild < length && heapArray[leftChild] < heapArray[targetIndex]) {
          targetIndex = leftChild
        }
        if (rightChild < length && heapArray[rightChild] < heapArray[targetIndex]) {
          targetIndex = rightChild
        }
      }

      if (targetIndex === index) break

      // Animate swap
      await animateSwap(index, targetIndex)

      // Perform swap
      const temp = heapArray[index]
      heapArray[index] = heapArray[targetIndex]
      heapArray[targetIndex] = temp

      index = targetIndex
    }
  }

  const animateSwap = async (index1: number, index2: number) => {
    const node1 = nodesRef.current[index1]
    const node2 = nodesRef.current[index2]

    if (!node1 || !node2) return

    const pos1 = node1.position.clone()
    const pos2 = node2.position.clone()

    return new Promise<void>((resolve) => {
      const duration = 1000
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeProgress = 1 - Math.pow(1 - progress, 3)

        // Animate positions with arc
        const arc1 = pos1.clone().lerp(pos2, easeProgress)
        const arc2 = pos2.clone().lerp(pos1, easeProgress)

        arc1.y += Math.sin(easeProgress * Math.PI) * 2
        arc2.y += Math.sin(easeProgress * Math.PI) * 2

        node1.position.copy(arc1)
        node2.position.copy(arc2)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          node1.position.copy(pos2)
          node2.position.copy(pos1)
          resolve()
        }
      }
      animate()
    })
  }

  const handleInsert = async () => {
    if (newValue && !isAnimating) {
      const value = Number.parseInt(newValue)
      if (!isNaN(value)) {
        setIsAnimating(true)
        const newArray = [...heapArray, value]
        setHeapArray(newArray)

        // Wait for visualization to update
        setTimeout(async () => {
          await heapifyUp(newArray.length - 1)
          setHeapArray([...heapArray])
          createHeapVisualization()
          setIsAnimating(false)
        }, 100)

        setNewValue("")
      }
    }
  }

  const handleExtractRoot = async () => {
    if (heapArray.length === 0 || isAnimating) return

    setIsAnimating(true)

    // Move last element to root
    const newArray = [...heapArray]
    newArray[0] = newArray[newArray.length - 1]
    newArray.pop()

    setHeapArray(newArray)

    if (newArray.length > 0) {
      setTimeout(async () => {
        await heapifyDown(0)
        setHeapArray([...heapArray])
        createHeapVisualization()
        setIsAnimating(false)
      }, 100)
    } else {
      setIsAnimating(false)
    }
  }

  const toggleHeapType = () => {
    if (!isAnimating) {
      setHeapType(heapType === "max" ? "min" : "max")
      // Re-heapify the entire array
      const newArray = [...heapArray].sort((a, b) => (heapType === "max" ? b - a : a - b))
      setHeapArray(newArray)
    }
  }

  useEffect(() => {
    createHeapVisualization()
  }, [heapArray])

  return (
    <div className="space-y-4">
      <div ref={mountRef} className="w-full flex justify-center" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="newValue">Insert Element</Label>
          <div className="flex gap-2">
            <Input
              id="newValue"
              type="number"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Enter value"
            />
            <Button onClick={handleInsert} disabled={isAnimating}>
              Insert
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Extract Root</Label>
          <Button onClick={handleExtractRoot} disabled={isAnimating || heapArray.length === 0} className="w-full">
            Extract {heapType === "max" ? "Max" : "Min"}
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Heap Type</Label>
          <Button onClick={toggleHeapType} disabled={isAnimating} className="w-full">
            {heapType === "max" ? "Max Heap" : "Min Heap"}
          </Button>
        </div>
      </div>

      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <h3 className="font-semibold mb-2 text-orange-900">Heap Characteristics:</h3>
        <ul className="text-sm space-y-1 text-orange-800">
          <li>• Complete binary tree stored as an array</li>
          <li>• Max Heap: parent ≥ children, Min Heap: parent ≤ children</li>
          <li>• Insert: O(log n), Extract root: O(log n)</li>
          <li>• Used in priority queues, heap sort, and graph algorithms</li>
          <li>• Array indices: parent = (i-1)/2, children = 2i+1, 2i+2</li>
        </ul>
      </div>
    </div>
  )
}
