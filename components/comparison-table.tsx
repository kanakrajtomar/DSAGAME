"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function ComparisonTable() {
  const comparisons = [
    {
      aspect: "Memory Layout",
      array: "Contiguous memory locations",
      linkedList: "Scattered throughout memory",
      arrayBetter: true,
    },
    {
      aspect: "Access Time",
      array: "O(1) - Direct indexing",
      linkedList: "O(n) - Sequential traversal",
      arrayBetter: true,
    },
    {
      aspect: "Insertion at Beginning",
      array: "O(n) - Shift all elements",
      linkedList: "O(1) - Update head pointer",
      arrayBetter: false,
    },
    {
      aspect: "Insertion at End",
      array: "O(1) - If space available",
      linkedList: "O(n) - Traverse to end",
      arrayBetter: true,
    },
    {
      aspect: "Deletion at Beginning",
      array: "O(n) - Shift all elements",
      linkedList: "O(1) - Update head pointer",
      arrayBetter: false,
    },
    {
      aspect: "Memory Overhead",
      array: "Low - Only data storage",
      linkedList: "High - Extra pointer storage",
      arrayBetter: true,
    },
    {
      aspect: "Cache Performance",
      array: "Excellent - Spatial locality",
      linkedList: "Poor - Random memory access",
      arrayBetter: true,
    },
    {
      aspect: "Size Flexibility",
      array: "Fixed size (in most cases)",
      linkedList: "Dynamic size",
      arrayBetter: false,
    },
  ]

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">Aspect</TableHead>
            <TableHead className="w-3/8">Array</TableHead>
            <TableHead className="w-3/8">Linked List</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comparisons.map((comparison, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{comparison.aspect}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{comparison.array}</span>
                  {comparison.arrayBetter && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Better
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{comparison.linkedList}</span>
                  {!comparison.arrayBetter && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Better
                    </Badge>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">When to Use Arrays</h3>
          <ul className="text-sm space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>When you need frequent random access to elements</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>When memory usage is a concern</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>When cache performance is important</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>When the size is relatively fixed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Mathematical computations and algorithms</span>
            </li>
          </ul>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-900 mb-3">When to Use Linked Lists</h3>
          <ul className="text-sm space-y-2 text-green-800">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>When frequent insertion/deletion at the beginning</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>When the size varies significantly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>When you don't know the maximum size</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Implementing other data structures (stacks, queues)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>When memory is allocated dynamically</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold mb-2">Key Takeaway</h3>
        <p className="text-sm text-gray-700">
          The choice between arrays and linked lists depends on your specific use case. Arrays excel at random access
          and memory efficiency, while linked lists shine in dynamic scenarios with frequent insertions and deletions.
          Understanding these trade-offs helps you make informed decisions in algorithm design and data structure
          selection.
        </p>
      </div>
    </div>
  )
}
