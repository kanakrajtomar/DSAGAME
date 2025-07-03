"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BTreeNode {
  keys: number[]
  children: BTreeNode[]
  isLeaf: boolean
  x?: number
  y?: number
}

export default function BTreeVisualization() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const nodesRef = useRef<THREE.Group[]>([])
  const [btreeRoot, setBtreeRoot] = useState<BTreeNode>({
    keys: [10, 20, 30],
    children: [
      { keys: [5, 8], children: [], isLeaf: true },
      { keys: [15, 18], children: [], isLeaf: true },
      { keys: [25, 28], children: [], isLeaf: true },
      { keys: [35, 40], children: [], isLeaf: true },
    ],
    isLeaf: false,
  })
  const [newValue, setNewValue] = useState("")
  const [degree, setDegree] = useState(3)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf8fafc)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 800 / 500, 0.1, 1000)
    camera.position.set(0, 8, 15)
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

    const directionalLight = new THREE.DirectionalLight(0xef4444, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    mountRef.current.appendChild(renderer.domElement)

    // Create initial B-tree
    createBTreeVisualization()

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

  const calculateNodePositions = (node: BTreeNode, x: number, y: number, spacing: number, level = 0) => {
    node.x = x
    node.y = y

    if (!node.isLeaf && node.children.length > 0) {
      const childSpacing = spacing / node.children.length
      const startX = x - spacing / 2

      node.children.forEach((child, index) => {
        const childX = startX + (index + 0.5) * childSpacing
        calculateNodePositions(child, childX, y - 3, spacing * 0.7, level + 1)
      })
    }
  }

  const createBTreeVisualization = () => {
    if (!sceneRef.current) return

    // Clear existing nodes
    nodesRef.current.forEach((node) => sceneRef.current!.remove(node))
    nodesRef.current = []

    // Calculate positions
    calculateNodePositions(btreeRoot, 0, 4, 12)

    // Create visualization
    createNodeVisualization(btreeRoot)
  }

  const createNodeVisualization = (node: BTreeNode) => {
    if (!sceneRef.current) return

    // Create node group
    const nodeGroup = new THREE.Group()

    // Create boxes for each key
    node.keys.forEach((key, index) => {
      const geometry = new THREE.BoxGeometry(1.2, 0.8, 0.4)
      const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0xef4444),
        transparent: true,
        opacity: 0.9,
      })
      const box = new THREE.Mesh(geometry, material)
      box.position.x = (index - (node.keys.length - 1) / 2) * 1.4
      box.castShadow = true
      box.receiveShadow = true
      nodeGroup.add(box)

      // Add key label
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")!
      canvas.width = 64
      canvas.height = 32
      context.fillStyle = "white"
      context.fillRect(0, 0, 64, 32)
      context.fillStyle = "#7f1d1d"
      context.font = "16px Arial"
      context.textAlign = "center"
      context.fillText(key.toString(), 32, 20)

      const texture = new THREE.CanvasTexture(canvas)
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture })
      const sprite = new THREE.Sprite(spriteMaterial)
      sprite.position.set(node.x! + (index - (node.keys.length - 1) / 2) * 1.4, node.y! + 0.6, 0)
      sprite.scale.set(0.8, 0.4, 1)
      sceneRef.current.add(sprite)
    })

    nodeGroup.position.set(node.x!, node.y!, 0)
    sceneRef.current.add(nodeGroup)
    nodesRef.current.push(nodeGroup)

    // Create edges to children and recursively create child nodes
    if (!node.isLeaf && node.children.length > 0) {
      node.children.forEach((child, index) => {
        createEdge(node, child, index)
        createNodeVisualization(child)
      })
    }
  }

  const createEdge = (parent: BTreeNode, child: BTreeNode, childIndex: number) => {
    if (!sceneRef.current) return

    const start = new THREE.Vector3(parent.x!, parent.y! - 0.5, 0)
    const end = new THREE.Vector3(child.x!, child.y! + 0.5, 0)
    const direction = end.clone().sub(start)
    const length = direction.length()

    const geometry = new THREE.CylinderGeometry(0.03, 0.03, length)
    const material = new THREE.MeshLambertMaterial({ color: 0x6b7280 })
    const cylinder = new THREE.Mesh(geometry, material)

    cylinder.position.copy(start.clone().add(end).multiplyScalar(0.5))
    cylinder.lookAt(end)
    cylinder.rotateX(Math.PI / 2)

    sceneRef.current.add(cylinder)
  }

  const animateNodeHighlight = async (node: BTreeNode) => {
    // Find the corresponding visual node and highlight it
    return new Promise<void>((resolve) => {
      setTimeout(resolve, 500)
    })
  }

  const handleInsert = () => {
    if (newValue && !isAnimating) {
      const value = Number.parseInt(newValue)
      if (!isNaN(value)) {
        // Simple insertion for demo - in real B-tree, this would be more complex
        const newRoot = { ...btreeRoot }
        if (newRoot.keys.length < 2 * degree - 1) {
          newRoot.keys.push(value)
          newRoot.keys.sort((a, b) => a - b)
        }
        setBtreeRoot(newRoot)
        setNewValue("")
      }
    }
  }

  const handleSearch = async () => {
    const value = Number.parseInt(newValue)
    if (!isNaN(value) && !isAnimating) {
      setIsAnimating(true)
      await animateNodeHighlight(btreeRoot)
      setIsAnimating(false)
    }
  }

  useEffect(() => {
    createBTreeVisualization()
  }, [btreeRoot])

  return (
    <div className="space-y-4">
      <div ref={mountRef} className="w-full flex justify-center" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="newValue">Insert Key</Label>
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
          <Label>Search Key</Label>
          <Button onClick={handleSearch} disabled={isAnimating} className="w-full">
            Search
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="degree">Degree (t)</Label>
          <Input
            id="degree"
            type="number"
            value={degree}
            onChange={(e) => setDegree(Number.parseInt(e.target.value) || 3)}
            min="2"
            max="5"
          />
        </div>
      </div>

      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <h3 className="font-semibold mb-2 text-red-900">B-Tree Characteristics:</h3>
        <ul className="text-sm space-y-1 text-red-800">
          <li>• Self-balancing tree optimized for disk I/O operations</li>
          <li>• Each node can contain multiple keys (up to 2t-1)</li>
          <li>• All leaves are at the same level</li>
          <li>• Search, insertion, deletion: O(log n)</li>
          <li>• Used in databases and file systems</li>
          <li>• Minimizes disk reads by storing multiple keys per node</li>
        </ul>
      </div>
    </div>
  )
}
