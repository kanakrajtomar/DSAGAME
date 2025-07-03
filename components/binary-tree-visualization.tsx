"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TreeNode {
  value: number
  left: TreeNode | null
  right: TreeNode | null
  x?: number
  y?: number
}

export default function BinaryTreeVisualization() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const nodesRef = useRef<Map<number, THREE.Group>>(new Map())
  const edgesRef = useRef<THREE.Group[]>([])
  const [treeRoot, setTreeRoot] = useState<TreeNode>({
    value: 50,
    left: {
      value: 30,
      left: { value: 20, left: null, right: null },
      right: { value: 40, left: null, right: null },
    },
    right: {
      value: 70,
      left: { value: 60, left: null, right: null },
      right: { value: 80, left: null, right: null },
    },
  })
  const [newValue, setNewValue] = useState("")
  const [searchValue, setSearchValue] = useState("")
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

    const directionalLight = new THREE.DirectionalLight(0x8b5cf6, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0xa855f7, 0.6, 100)
    pointLight.position.set(0, 10, 0)
    scene.add(pointLight)

    mountRef.current.appendChild(renderer.domElement)

    // Create initial tree
    createTreeVisualization()

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

  const calculateNodePositions = (node: TreeNode | null, x: number, y: number, spacing: number): void => {
    if (!node) return

    node.x = x
    node.y = y

    if (node.left) {
      calculateNodePositions(node.left, x - spacing, y - 3, spacing * 0.6)
    }
    if (node.right) {
      calculateNodePositions(node.right, x + spacing, y - 3, spacing * 0.6)
    }
  }

  const createTreeVisualization = () => {
    if (!sceneRef.current) return

    // Clear existing nodes and edges
    nodesRef.current.forEach((node) => sceneRef.current!.remove(node))
    edgesRef.current.forEach((edge) => sceneRef.current!.remove(edge))
    nodesRef.current.clear()
    edgesRef.current = []

    // Calculate positions
    calculateNodePositions(treeRoot, 0, 4, 4)

    // Create nodes and edges
    createNodeVisualization(treeRoot)
  }

  const createNodeVisualization = (node: TreeNode | null) => {
    if (!node || !sceneRef.current) return

    // Create node group
    const nodeGroup = new THREE.Group()

    // Create sphere for node
    const geometry = new THREE.SphereGeometry(0.8, 16, 16)
    const material = new THREE.MeshLambertMaterial({
      color: new THREE.Color(0x8b5cf6),
      transparent: true,
      opacity: 0.9,
    })
    const sphere = new THREE.Mesh(geometry, material)
    sphere.castShadow = true
    sphere.receiveShadow = true
    nodeGroup.add(sphere)

    // Position the node
    nodeGroup.position.set(node.x!, node.y!, 0)
    sceneRef.current.add(nodeGroup)
    nodesRef.current.set(node.value, nodeGroup)

    // Add value label
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")!
    canvas.width = 128
    canvas.height = 64
    context.fillStyle = "white"
    context.fillRect(0, 0, 128, 64)
    context.fillStyle = "#581c87"
    context.font = "bold 32px Arial"
    context.textAlign = "center"
    context.fillText(node.value.toString(), 64, 42)

    const texture = new THREE.CanvasTexture(canvas)
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture })
    const sprite = new THREE.Sprite(spriteMaterial)
    sprite.position.copy(nodeGroup.position)
    sprite.position.y += 1.2
    sprite.scale.set(1.5, 0.75, 1)
    sceneRef.current.add(sprite)

    // Create edges to children
    if (node.left) {
      createEdge(node, node.left)
      createNodeVisualization(node.left)
    }
    if (node.right) {
      createEdge(node, node.right)
      createNodeVisualization(node.right)
    }
  }

  const createEdge = (parent: TreeNode, child: TreeNode) => {
    if (!sceneRef.current) return

    const edgeGroup = new THREE.Group()

    const start = new THREE.Vector3(parent.x!, parent.y!, 0)
    const end = new THREE.Vector3(child.x!, child.y!, 0)
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

  const insertNode = (root: TreeNode | null, value: number): TreeNode => {
    if (!root) {
      return { value, left: null, right: null }
    }

    if (value < root.value) {
      root.left = insertNode(root.left, value)
    } else if (value > root.value) {
      root.right = insertNode(root.right, value)
    }

    return root
  }

  const animateSearch = async (value: number) => {
    if (isAnimating) return

    setIsAnimating(true)
    let current = treeRoot
    const path: number[] = []

    // Find path to target
    while (current) {
      path.push(current.value)
      if (value === current.value) break
      current = value < current.value ? current.left : current.right
    }

    // Animate the search path
    for (const nodeValue of path) {
      const nodeGroup = nodesRef.current.get(nodeValue)
      if (nodeGroup) {
        const sphere = nodeGroup.children[0] as THREE.Mesh
        const originalColor = (sphere.material as THREE.MeshLambertMaterial).color.clone()

        // Highlight node
        ;(sphere.material as THREE.MeshLambertMaterial).color = new THREE.Color(0xef4444)

        // Animate pulse
        await new Promise<void>((resolve) => {
          const startTime = Date.now()
          const duration = 800
          const originalScale = nodeGroup.scale.clone()

          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const pulse = 1 + 0.3 * Math.sin(progress * Math.PI * 4)

            nodeGroup.scale.setScalar(pulse)

            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              nodeGroup.scale.copy(originalScale)
              resolve()
            }
          }
          animate()
        })

        // Restore color if not the target
        if (nodeValue !== value) {
          ;(sphere.material as THREE.MeshLambertMaterial).color = originalColor
        }

        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    setIsAnimating(false)
  }

  const handleInsert = () => {
    if (newValue && !isAnimating) {
      const value = Number.parseInt(newValue)
      if (!isNaN(value)) {
        const newRoot = insertNode(treeRoot, value)
        setTreeRoot({ ...newRoot })
        setNewValue("")
      }
    }
  }

  const handleSearch = () => {
    const value = Number.parseInt(searchValue)
    if (!isNaN(value)) {
      animateSearch(value)
    }
  }

  useEffect(() => {
    createTreeVisualization()
  }, [treeRoot])

  return (
    <div className="space-y-4">
      <div ref={mountRef} className="w-full flex justify-center" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="newValue">Insert Node</Label>
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
          <Label htmlFor="searchValue">Search Node</Label>
          <div className="flex gap-2">
            <Input
              id="searchValue"
              type="number"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Enter value"
            />
            <Button onClick={handleSearch} disabled={isAnimating}>
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h3 className="font-semibold mb-2 text-purple-900">Binary Tree Characteristics:</h3>
        <ul className="text-sm space-y-1 text-purple-800">
          <li>• Each node has at most two children (left and right)</li>
          <li>• Binary Search Tree: left child &lt; parent &lt; right child</li>
          <li>• Search, insertion, deletion: O(log n) average, O(n) worst case</li>
          <li>• Used in databases, expression parsing, and decision trees</li>
        </ul>
      </div>
    </div>
  )
}
