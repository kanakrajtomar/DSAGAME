"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ListNode {
  value: number
  next: ListNode | null
}

export default function LinkedListVisualization() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const nodesRef = useRef<THREE.Group[]>([])
  const arrowsRef = useRef<THREE.Group[]>([])
  const [listData, setListData] = useState<ListNode>({
    value: 10,
    next: {
      value: 25,
      next: {
        value: 30,
        next: {
          value: 45,
          next: null,
        },
      },
    },
  })
  const [newValue, setNewValue] = useState("")
  const [traverseStep, setTraverseStep] = useState(-1)
  const [isAnimating, setIsAnimating] = useState(false)

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

    const directionalLight = new THREE.DirectionalLight(0x10b981, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(25, 10)
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -2
    ground.receiveShadow = true
    scene.add(ground)

    mountRef.current.appendChild(renderer.domElement)

    // Create initial linked list
    createLinkedListVisualization()

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

  const listToArray = (head: ListNode | null): number[] => {
    const result: number[] = []
    let current = head
    while (current) {
      result.push(current.value)
      current = current.next
    }
    return result
  }

  const createLinkedListVisualization = () => {
    if (!sceneRef.current) return

    // Clear existing nodes and arrows
    nodesRef.current.forEach((node) => sceneRef.current!.remove(node))
    arrowsRef.current.forEach((arrow) => sceneRef.current!.remove(arrow))
    nodesRef.current = []
    arrowsRef.current = []

    const values = listToArray(listData)

    values.forEach((value, index) => {
      // Create node group
      const nodeGroup = new THREE.Group()

      // Create main cube for data
      const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)
      const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0x10b981),
      })
      const cube = new THREE.Mesh(geometry, material)
      cube.castShadow = true
      cube.receiveShadow = true
      nodeGroup.add(cube)

      // Create pointer box
      const pointerGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8)
      const pointerMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0x059669),
      })
      const pointerCube = new THREE.Mesh(pointerGeometry, pointerMaterial)
      pointerCube.position.set(1.2, 0, 0)
      pointerCube.castShadow = true
      nodeGroup.add(pointerCube)

      // Position the entire node
      nodeGroup.position.x = (index - values.length / 2) * 4
      nodeGroup.position.y = 0

      sceneRef.current!.add(nodeGroup)
      nodesRef.current.push(nodeGroup)

      // Add data label
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")!
      canvas.width = 128
      canvas.height = 64
      context.fillStyle = "white"
      context.fillRect(0, 0, 128, 64)
      context.fillStyle = "#065f46"
      context.font = "24px Arial"
      context.textAlign = "center"
      context.fillText(value.toString(), 64, 40)

      const texture = new THREE.CanvasTexture(canvas)
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture })
      const sprite = new THREE.Sprite(spriteMaterial)
      sprite.position.copy(nodeGroup.position)
      sprite.position.y += 1.5
      sprite.scale.set(1, 0.5, 1)
      sceneRef.current!.add(sprite)

      // Create arrow to next node (if not last)
      if (index < values.length - 1) {
        const arrowGroup = new THREE.Group()

        // Arrow shaft
        const shaftGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2)
        const shaftMaterial = new THREE.MeshLambertMaterial({ color: 0x6b7280 })
        const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial)
        shaft.rotation.z = Math.PI / 2
        arrowGroup.add(shaft)

        // Arrow head
        const headGeometry = new THREE.ConeGeometry(0.15, 0.3)
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0x6b7280 })
        const head = new THREE.Mesh(headGeometry, headMaterial)
        head.position.x = 1.15
        head.rotation.z = -Math.PI / 2
        arrowGroup.add(head)

        arrowGroup.position.x = nodeGroup.position.x + 2
        arrowGroup.position.y = 0

        sceneRef.current!.add(arrowGroup)
        arrowsRef.current.push(arrowGroup)
      } else {
        // Add NULL label for last node
        const nullCanvas = document.createElement("canvas")
        const nullContext = nullCanvas.getContext("2d")!
        nullCanvas.width = 64
        nullCanvas.height = 32
        nullContext.fillStyle = "#ef4444"
        nullContext.fillRect(0, 0, 64, 32)
        nullContext.fillStyle = "white"
        nullContext.font = "16px Arial"
        nullContext.textAlign = "center"
        nullContext.fillText("NULL", 32, 20)

        const nullTexture = new THREE.CanvasTexture(nullCanvas)
        const nullSpriteMaterial = new THREE.SpriteMaterial({ map: nullTexture })
        const nullSprite = new THREE.Sprite(nullSpriteMaterial)
        nullSprite.position.set(nodeGroup.position.x + 2, 0, 0)
        nullSprite.scale.set(0.8, 0.4, 1)
        sceneRef.current!.add(nullSprite)
      }
    })
  }

  const animateTraversal = async () => {
    if (isAnimating) return

    setIsAnimating(true)
    const values = listToArray(listData)

    for (let i = 0; i < values.length; i++) {
      setTraverseStep(i)

      // Highlight current node
      const nodeGroup = nodesRef.current[i]
      const cube = nodeGroup.children[0] as THREE.Mesh
      const originalColor = (cube.material as THREE.MeshLambertMaterial).color.clone()
      ;(cube.material as THREE.MeshLambertMaterial).color = new THREE.Color(0xef4444)

      // Animate node movement
      const originalY = nodeGroup.position.y
      await new Promise<void>((resolve) => {
        const startTime = Date.now()
        const duration = 800

        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          const bounce = Math.sin(progress * Math.PI)

          nodeGroup.position.y = originalY + bounce * 0.5

          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            nodeGroup.position.y = originalY
            resolve()
          }
        }
        animate()
      })

      // Restore color
      ;(cube.material as THREE.MeshLambertMaterial).color = originalColor

      if (i < values.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    setTraverseStep(-1)
    setIsAnimating(false)
  }

  const handleAddElement = () => {
    if (newValue && !isAnimating) {
      const value = Number.parseInt(newValue)
      if (!isNaN(value)) {
        // Add to beginning of list
        const newNode: ListNode = {
          value,
          next: listData,
        }
        setListData(newNode)
        setNewValue("")
      }
    }
  }

  const handleRemoveElement = () => {
    if (listData && listData.next && !isAnimating) {
      setListData(listData.next)
    }
  }

  useEffect(() => {
    createLinkedListVisualization()
  }, [listData])

  return (
    <div className="space-y-4">
      <div ref={mountRef} className="w-full flex justify-center" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="newValue">Add Element (at beginning)</Label>
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
          <Label>Traverse List</Label>
          <Button onClick={animateTraversal} disabled={isAnimating} className="w-full">
            {isAnimating ? `Step ${traverseStep + 1}` : "Start Traversal"}
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Remove Element</Label>
          <Button onClick={handleRemoveElement} disabled={isAnimating || !listData?.next} className="w-full">
            Remove First
          </Button>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="font-semibold mb-2 text-green-900">Linked List Characteristics:</h3>
        <ul className="text-sm space-y-1 text-green-800">
          <li>• Elements (nodes) are stored anywhere in memory</li>
          <li>• Each node contains data and a pointer to the next node</li>
          <li>• Sequential access only: O(n) to reach any element</li>
          <li>• Dynamic size - can grow/shrink during runtime</li>
          <li>• O(1) insertion/deletion at the beginning</li>
        </ul>
      </div>
    </div>
  )
}
