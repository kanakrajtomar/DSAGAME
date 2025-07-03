"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { Button } from "@/components/ui/button"

interface TreeNode {
  value: number
  left: TreeNode | null
  right: TreeNode | null
  x?: number
  y?: number
}

export default function TreeTraversal() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const nodesRef = useRef<Map<number, THREE.Group>>(new Map())
  const [treeRoot] = useState<TreeNode>({
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
  const [traversalType, setTraversalType] = useState<"inorder" | "preorder" | "postorder" | "levelorder">("inorder")
  const [isAnimating, setIsAnimating] = useState(false)
  const [traversalResult, setTraversalResult] = useState<number[]>([])
  const [currentStep, setCurrentStep] = useState(-1)

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

    const directionalLight = new THREE.DirectionalLight(0x06b6d4, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    mountRef.current.appendChild(renderer.domElement)

    // Create tree
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

    // Clear existing nodes
    nodesRef.current.forEach((node) => sceneRef.current!.remove(node))
    nodesRef.current.clear()

    // Calculate positions
    calculateNodePositions(treeRoot, 0, 4, 4)

    // Create nodes
    createNodeVisualization(treeRoot)
  }

  const createNodeVisualization = (node: TreeNode | null) => {
    if (!node || !sceneRef.current) return

    // Create node group
    const nodeGroup = new THREE.Group()

    // Create sphere for node
    const geometry = new THREE.SphereGeometry(0.8, 16, 16)
    const material = new THREE.MeshLambertMaterial({
      color: new THREE.Color(0x06b6d4),
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
    context.fillStyle = "#0e7490"
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

    sceneRef.current.add(cylinder)
  }

  const inorderTraversal = (node: TreeNode | null, result: number[] = []): number[] => {
    if (node) {
      inorderTraversal(node.left, result)
      result.push(node.value)
      inorderTraversal(node.right, result)
    }
    return result
  }

  const preorderTraversal = (node: TreeNode | null, result: number[] = []): number[] => {
    if (node) {
      result.push(node.value)
      preorderTraversal(node.left, result)
      preorderTraversal(node.right, result)
    }
    return result
  }

  const postorderTraversal = (node: TreeNode | null, result: number[] = []): number[] => {
    if (node) {
      postorderTraversal(node.left, result)
      postorderTraversal(node.right, result)
      result.push(node.value)
    }
    return result
  }

  const levelorderTraversal = (root: TreeNode | null): number[] => {
    if (!root) return []

    const result: number[] = []
    const queue: TreeNode[] = [root]

    while (queue.length > 0) {
      const node = queue.shift()!
      result.push(node.value)

      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }

    return result
  }

  const animateTraversal = async () => {
    if (isAnimating) return

    setIsAnimating(true)
    setCurrentStep(-1)

    // Reset all node colors
    nodesRef.current.forEach((nodeGroup) => {
      const sphere = nodeGroup.children[0] as THREE.Mesh
      ;(sphere.material as THREE.MeshLambertMaterial).color = new THREE.Color(0x06b6d4)
    })

    // Get traversal result
    let result: number[] = []
    switch (traversalType) {
      case "inorder":
        result = inorderTraversal(treeRoot)
        break
      case "preorder":
        result = preorderTraversal(treeRoot)
        break
      case "postorder":
        result = postorderTraversal(treeRoot)
        break
      case "levelorder":
        result = levelorderTraversal(treeRoot)
        break
    }

    setTraversalResult(result)

    // Animate each step
    for (let i = 0; i < result.length; i++) {
      setCurrentStep(i)
      const nodeValue = result[i]
      const nodeGroup = nodesRef.current.get(nodeValue)

      if (nodeGroup) {
        const sphere = nodeGroup.children[0] as THREE.Mesh

        // Highlight current node
        ;(sphere.material as THREE.MeshLambertMaterial).color = new THREE.Color(0xef4444)

        // Animate pulse
        await new Promise<void>((resolve) => {
          const startTime = Date.now()
          const duration = 1000
          const originalScale = nodeGroup.scale.clone()

          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const pulse = 1 + 0.4 * Math.sin(progress * Math.PI * 3)

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

        // Change to visited color
        ;(sphere.material as THREE.MeshLambertMaterial).color = new THREE.Color(0x22c55e)

        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    setIsAnimating(false)
  }

  const resetVisualization = () => {
    nodesRef.current.forEach((nodeGroup) => {
      const sphere = nodeGroup.children[0] as THREE.Mesh
      ;(sphere.material as THREE.MeshLambertMaterial).color = new THREE.Color(0x06b6d4)
    })
    setTraversalResult([])
    setCurrentStep(-1)
  }

  return (
    <div className="space-y-4">
      <div ref={mountRef} className="w-full flex justify-center" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          onClick={() => setTraversalType("inorder")}
          variant={traversalType === "inorder" ? "default" : "outline"}
        >
          In-order
        </Button>
        <Button
          onClick={() => setTraversalType("preorder")}
          variant={traversalType === "preorder" ? "default" : "outline"}
        >
          Pre-order
        </Button>
        <Button
          onClick={() => setTraversalType("postorder")}
          variant={traversalType === "postorder" ? "default" : "outline"}
        >
          Post-order
        </Button>
        <Button
          onClick={() => setTraversalType("levelorder")}
          variant={traversalType === "levelorder" ? "default" : "outline"}
        >
          Level-order
        </Button>
      </div>

      <div className="flex gap-4">
        <Button onClick={animateTraversal} disabled={isAnimating}>
          {isAnimating ? `Step ${currentStep + 1}` : "Start Traversal"}
        </Button>
        <Button onClick={resetVisualization} variant="outline">
          Reset
        </Button>
      </div>

      {traversalResult.length > 0 && (
        <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
          <h3 className="font-semibold mb-2 text-cyan-900">
            {traversalType.charAt(0).toUpperCase() + traversalType.slice(1)} Traversal Result:
          </h3>
          <div className="flex flex-wrap gap-2">
            {traversalResult.map((value, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded ${
                  index <= currentStep
                    ? "bg-green-500 text-white"
                    : index === currentStep + 1 && isAnimating
                      ? "bg-red-500 text-white"
                      : "bg-gray-300 text-gray-700"
                }`}
              >
                {value}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
          <h3 className="font-semibold mb-2 text-cyan-900">Traversal Types</h3>
          <ul className="text-sm space-y-2 text-cyan-800">
            <li>
              <strong>In-order:</strong> Left → Root → Right (gives sorted order for BST)
            </li>
            <li>
              <strong>Pre-order:</strong> Root → Left → Right (useful for copying tree)
            </li>
            <li>
              <strong>Post-order:</strong> Left → Right → Root (useful for deleting tree)
            </li>
            <li>
              <strong>Level-order:</strong> Visit nodes level by level (BFS)
            </li>
          </ul>
        </div>

        <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
          <h3 className="font-semibold mb-2 text-cyan-900">Applications</h3>
          <ul className="text-sm space-y-2 text-cyan-800">
            <li>
              <strong>In-order:</strong> Expression evaluation, BST validation
            </li>
            <li>
              <strong>Pre-order:</strong> Tree serialization, prefix expressions
            </li>
            <li>
              <strong>Post-order:</strong> Directory size calculation, postfix expressions
            </li>
            <li>
              <strong>Level-order:</strong> Tree printing, shortest path in unweighted trees
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
