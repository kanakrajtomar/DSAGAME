"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ArrayVisualization from "@/components/array-visualization"
import LinkedListVisualization from "@/components/linked-list-visualization"
import BinaryTreeVisualization from "@/components/binary-tree-visualization"
import HeapVisualization from "@/components/heap-visualization"
import BTreeVisualization from "@/components/btree-visualization"
import SearchAlgorithms from "@/components/search-algorithms"
import TreeTraversal from "@/components/tree-traversal"
import ComparisonTable from "@/components/comparison-table"
import ProblemSolver from "@/components/problem-solver"

export default function DataStructuresVisualizer() {
  const [activeDemo, setActiveDemo] = useState<
    "array" | "linkedlist" | "binarytree" | "heap" | "btree" | "search" | "traversal" | "problems" | "comparison"
  >("array")

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Data Structures & Algorithms Hub</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master data structures through interactive 3D visualizations and solve coding problems with our integrated
            compiler
          </p>
        </div>

        <Tabs value={activeDemo} onValueChange={(value) => setActiveDemo(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 mb-8">
            <TabsTrigger value="array">Array</TabsTrigger>
            <TabsTrigger value="linkedlist">Linked List</TabsTrigger>
            <TabsTrigger value="binarytree">Binary Tree</TabsTrigger>
            <TabsTrigger value="heap">Heap</TabsTrigger>
            <TabsTrigger value="btree">B-Tree</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="traversal">Traversal</TabsTrigger>
            <TabsTrigger value="problems">Problems</TabsTrigger>
            <TabsTrigger value="comparison">Compare</TabsTrigger>
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

            <Card>
              <CardHeader>
                <CardTitle>Top Array Interview Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-600">Easy Problems:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Two Sum</li>
                      <li>• Remove Duplicates from Sorted Array</li>
                      <li>• Maximum Subarray (Kadane's Algorithm)</li>
                      <li>• Merge Sorted Array</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-orange-600">Medium Problems:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 3Sum</li>
                      <li>• Container With Most Water</li>
                      <li>• Product of Array Except Self</li>
                      <li>• Rotate Array</li>
                    </ul>
                  </div>
                </div>
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

            <Card>
              <CardHeader>
                <CardTitle>Top Linked List Interview Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-600">Easy Problems:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Reverse Linked List</li>
                      <li>• Merge Two Sorted Lists</li>
                      <li>• Remove Duplicates from Sorted List</li>
                      <li>• Linked List Cycle</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-orange-600">Medium Problems:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Add Two Numbers</li>
                      <li>• Remove Nth Node From End</li>
                      <li>• Linked List Cycle II</li>
                      <li>• Intersection of Two Linked Lists</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="binarytree" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  Binary Tree Data Structure
                </CardTitle>
                <CardDescription>
                  Binary trees are hierarchical structures where each node has at most two children.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BinaryTreeVisualization />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Binary Tree Interview Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-600">Easy Problems:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Maximum Depth of Binary Tree</li>
                      <li>• Same Tree</li>
                      <li>• Invert Binary Tree</li>
                      <li>• Symmetric Tree</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-orange-600">Medium Problems:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Binary Tree Level Order Traversal</li>
                      <li>• Validate Binary Search Tree</li>
                      <li>• Lowest Common Ancestor</li>
                      <li>• Binary Tree Right Side View</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="heap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  Heap Data Structure
                </CardTitle>
                <CardDescription>
                  Heaps are complete binary trees that satisfy the heap property for priority operations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HeapVisualization />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Heap Interview Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-600">Easy Problems:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Kth Largest Element in Array</li>
                      <li>• Last Stone Weight</li>
                      <li>• Find Median from Data Stream</li>
                      <li>• Top K Frequent Elements</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-orange-600">Medium Problems:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Merge k Sorted Lists</li>
                      <li>• Task Scheduler</li>
                      <li>• Ugly Number II</li>
                      <li>• Meeting Rooms II</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="btree" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  B-Tree Data Structure
                </CardTitle>
                <CardDescription>
                  B-Trees are self-balancing trees optimized for systems that read/write large blocks of data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BTreeVisualization />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  Search Algorithms
                </CardTitle>
                <CardDescription>
                  Visualize different search algorithms and their performance characteristics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SearchAlgorithms />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Search Algorithm Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-600">Binary Search Problems:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Search Insert Position</li>
                      <li>• Find First and Last Position</li>
                      <li>• Search in Rotated Sorted Array</li>
                      <li>• Find Peak Element</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-orange-600">Advanced Search:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Search a 2D Matrix</li>
                      <li>• Find Minimum in Rotated Array</li>
                      <li>• Median of Two Sorted Arrays</li>
                      <li>• Kth Smallest Element in BST</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traversal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-cyan-500 rounded"></div>
                  Tree Traversal Algorithms
                </CardTitle>
                <CardDescription>
                  Explore different tree traversal methods: In-order, Pre-order, Post-order, and Level-order.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TreeTraversal />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="problems" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-indigo-500 rounded"></div>
                  Coding Problems & Compiler
                </CardTitle>
                <CardDescription>
                  Solve data structure problems with our integrated compiler supporting Java, C++, and Python.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProblemSolver />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Structures Comparison</CardTitle>
                <CardDescription>Understanding the key differences between fundamental data structures</CardDescription>
              </CardHeader>
              <CardContent>
                <ComparisonTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Linear Structures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Arrays: O(1) access, fixed size</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Linked Lists: Dynamic size, O(n) access</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600">Tree Structures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Binary Trees: Hierarchical, O(log n) operations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Heaps: Priority queue operations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>B-Trees: Database and file systems</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">Algorithms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Linear Search: O(n) time complexity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Binary Search: O(log n) on sorted data</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Tree Traversals: Different visiting orders</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
