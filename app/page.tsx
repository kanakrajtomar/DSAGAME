"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ArrayVisualization from "@/components/array-visualization"
import LinkedListVisualization from "@/components/linked-list-visualization"
import ComparisonTable from "@/components/comparison-table"

export default function DataStructuresVisualizer() {
  const [activeDemo, setActiveDemo] = useState<"array" | "linkedlist" | "comparison">("array")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Data Structures Visualizer</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore the differences between Arrays and Linked Lists through interactive 3D animations
          </p>
        </div>

        <Tabs value={activeDemo} onValueChange={(value) => setActiveDemo(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="array">Array Visualization</TabsTrigger>
            <TabsTrigger value="linkedlist">Linked List Visualization</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="array" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  Array Data Structure
                </CardTitle>
                <CardDescription>
                  Arrays store elements in contiguous memory locations, allowing direct access via indices.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ArrayVisualization />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="linkedlist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  Linked List Data Structure
                </CardTitle>
                <CardDescription>
                  Linked lists store elements in nodes, where each node contains data and a pointer to the next node.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LinkedListVisualization />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Arrays vs Linked Lists Comparison</CardTitle>
                <CardDescription>
                  Understanding the key differences between these fundamental data structures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComparisonTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Array Advantages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>O(1) random access by index</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Memory efficient (no extra pointers)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Cache-friendly due to locality</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Simple implementation</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Linked List Advantages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Dynamic size (grows/shrinks at runtime)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>O(1) insertion/deletion at beginning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>No memory waste</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Flexible memory allocation</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
