"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Play, RotateCcw } from "lucide-react"

interface Problem {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  description: string
  examples: Array<{
    input: string
    output: string
    explanation?: string
  }>
  constraints: string[]
  testCases: Array<{
    input: string
    expectedOutput: string
    hidden?: boolean
  }>
  starterCode: {
    java: string
    cpp: string
    python: string
  }
}

const problems: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists.",
    ],
    testCases: [
      { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]" },
      { input: "[3,2,4]\n6", expectedOutput: "[1,2]" },
      { input: "[3,3]\n6", expectedOutput: "[0,1]" },
      { input: "[1,2,3,4,5]\n8", expectedOutput: "[2,4]", hidden: true },
      { input: "[-1,-2,-3,-4,-5]\n-8", expectedOutput: "[2,4]", hidden: true },
    ],
    starterCode: {
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        
    }
};`,
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your solution here
        pass`,
    },
  },
  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Easy",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
      },
    ],
    constraints: ["The number of nodes in the list is the range [0, 5000].", "-5000 ≤ Node.val ≤ 5000"],
    testCases: [
      { input: "[1,2,3,4,5]", expectedOutput: "[5,4,3,2,1]" },
      { input: "[1,2]", expectedOutput: "[2,1]" },
      { input: "[]", expectedOutput: "[]" },
      { input: "[1]", expectedOutput: "[1]", hidden: true },
    ],
    starterCode: {
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        // Write your solution here
        
    }
}`,
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Write your solution here
        
    }
};`,
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # Write your solution here
        pass`,
    },
  },
  {
    id: "maximum-depth-binary-tree",
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    description:
      "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "3",
      },
    ],
    constraints: ["The number of nodes in the tree is in the range [0, 10⁴].", "-100 ≤ Node.val ≤ 100"],
    testCases: [
      { input: "[3,9,20,null,null,15,7]", expectedOutput: "3" },
      { input: "[1,null,2]", expectedOutput: "2" },
      { input: "[]", expectedOutput: "0" },
      { input: "[1,2,3,4,5]", expectedOutput: "3", hidden: true },
    ],
    starterCode: {
      java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public int maxDepth(TreeNode root) {
        // Write your solution here
        
    }
}`,
      cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *l, TreeNode *r) : val(x), left(l), right(r) {}
 * };
 */
class Solution {
public:
    int maxDepth(TreeNode* root) {
        // Write your solution here
        
    }
};`,
      python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        # Write your solution here
        pass`,
    },
  },
  {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    description:
      "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "9 exists in nums and its index is 4",
      },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 10⁴",
      "-10⁴ < nums[i], target < 10⁴",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order.",
    ],
    testCases: [
      { input: "[-1,0,3,5,9,12]\n9", expectedOutput: "4" },
      { input: "[-1,0,3,5,9,12]\n2", expectedOutput: "-1" },
      { input: "[5]\n5", expectedOutput: "0" },
      { input: "[1,2,3,4,5,6,7,8,9,10]\n7", expectedOutput: "6", hidden: true },
    ],
    starterCode: {
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Write your solution here
        
    }
}`,
      cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        // Write your solution here
        
    }
};`,
      python: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        # Write your solution here
        pass`,
    },
  },
]

export default function ProblemSolver() {
  const [selectedProblem, setSelectedProblem] = useState<Problem>(problems[0])
  const [language, setLanguage] = useState<"java" | "cpp" | "python">("python")
  const [code, setCode] = useState("")
  const [testResults, setTestResults] = useState<
    Array<{ passed: boolean; input: string; expected: string; actual: string }>
  >([])
  const [isRunning, setIsRunning] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleProblemChange = (problemId: string) => {
    const problem = problems.find((p) => p.id === problemId)
    if (problem) {
      setSelectedProblem(problem)
      setCode(problem.starterCode[language])
      setShowResults(false)
      setTestResults([])
    }
  }

  const handleLanguageChange = (newLanguage: "java" | "cpp" | "python") => {
    setLanguage(newLanguage)
    setCode(selectedProblem.starterCode[newLanguage])
    setShowResults(false)
    setTestResults([])
  }

  const simulateCodeExecution = (code: string, testCase: { input: string; expectedOutput: string }) => {
    // This is a simulation - in a real implementation, you'd send this to a backend compiler
    const problemId = selectedProblem.id

    // Simulate some basic test case validation
    if (problemId === "two-sum") {
      // Simple simulation for Two Sum
      if (code.includes("HashMap") || code.includes("dict") || code.includes("unordered_map")) {
        return { passed: true, actual: testCase.expectedOutput }
      } else if (code.includes("for") && code.includes("for")) {
        // Nested loops - might work but inefficient
        return { passed: true, actual: testCase.expectedOutput }
      }
    } else if (problemId === "binary-search") {
      if (
        code.includes("while") &&
        (code.includes("left") || code.includes("low")) &&
        (code.includes("right") || code.includes("high"))
      ) {
        return { passed: true, actual: testCase.expectedOutput }
      }
    } else if (problemId === "reverse-linked-list") {
      if ((code.includes("prev") && code.includes("current")) || code.includes("next")) {
        return { passed: true, actual: testCase.expectedOutput }
      }
    } else if (problemId === "maximum-depth-binary-tree") {
      if (code.includes("max") && (code.includes("recursive") || (code.includes("left") && code.includes("right")))) {
        return { passed: true, actual: testCase.expectedOutput }
      }
    }

    // Random simulation for demonstration
    const shouldPass = Math.random() > 0.3 // 70% pass rate for demo
    return {
      passed: shouldPass,
      actual: shouldPass ? testCase.expectedOutput : "Wrong Answer",
    }
  }

  const runTests = async () => {
    setIsRunning(true)
    setShowResults(false)

    // Simulate compilation delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const results = selectedProblem.testCases.map((testCase) => {
      const result = simulateCodeExecution(code, testCase)
      return {
        passed: result.passed,
        input: testCase.input,
        expected: testCase.expectedOutput,
        actual: result.actual,
      }
    })

    setTestResults(results)
    setShowResults(true)
    setIsRunning(false)
  }

  const resetCode = () => {
    setCode(selectedProblem.starterCode[language])
    setShowResults(false)
    setTestResults([])
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const passedTests = testResults.filter((r) => r.passed).length
  const totalTests = testResults.length

  return (
    <div className="space-y-6">
      {/* Problem Selection */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Select value={selectedProblem.id} onValueChange={handleProblemChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a problem" />
            </SelectTrigger>
            <SelectContent>
              {problems.map((problem) => (
                <SelectItem key={problem.id} value={problem.id}>
                  <div className="flex items-center gap-2">
                    <span>{problem.title}</span>
                    <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={resetCode} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Problem Description */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {selectedProblem.title}
                <Badge className={getDifficultyColor(selectedProblem.difficulty)}>{selectedProblem.difficulty}</Badge>
              </CardTitle>
            </div>
            <CardDescription>{selectedProblem.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="examples" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="examples">Examples</TabsTrigger>
                <TabsTrigger value="constraints">Constraints</TabsTrigger>
                <TabsTrigger value="testcases">Test Cases</TabsTrigger>
              </TabsList>

              <TabsContent value="examples" className="space-y-4">
                {selectedProblem.examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div>
                        <strong>Input:</strong> <code className="bg-gray-200 px-1 rounded">{example.input}</code>
                      </div>
                      <div>
                        <strong>Output:</strong> <code className="bg-gray-200 px-1 rounded">{example.output}</code>
                      </div>
                      {example.explanation && (
                        <div>
                          <strong>Explanation:</strong> {example.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="constraints">
                <ul className="space-y-1">
                  {selectedProblem.constraints.map((constraint, index) => (
                    <li key={index} className="text-sm">
                      • {constraint}
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="testcases">
                <div className="space-y-2">
                  {selectedProblem.testCases
                    .filter((tc) => !tc.hidden)
                    .map((testCase, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded text-sm">
                        <div>
                          <strong>Input:</strong> {testCase.input}
                        </div>
                        <div>
                          <strong>Expected:</strong> {testCase.expectedOutput}
                        </div>
                      </div>
                    ))}
                  <p className="text-sm text-gray-600">
                    + {selectedProblem.testCases.filter((tc) => tc.hidden).length} hidden test cases
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Code Editor */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Code Editor</CardTitle>
              <div className="flex gap-2">
                <Button onClick={runTests} disabled={isRunning}>
                  <Play className="w-4 h-4 mr-1" />
                  {isRunning ? "Running..." : "Run Tests"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 p-3 font-mono text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your solution here..."
              />

              {showResults && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Test Results:</span>
                    <Badge
                      className={passedTests === totalTests ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {passedTests}/{totalTests} Passed
                    </Badge>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {testResults.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${result.passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {result.passed ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className="font-medium">Test Case {index + 1}</span>
                        </div>
                        <div className="text-sm space-y-1">
                          <div>
                            <strong>Input:</strong> {result.input}
                          </div>
                          <div>
                            <strong>Expected:</strong> {result.expected}
                          </div>
                          <div>
                            <strong>Actual:</strong> {result.actual}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Problem-Solving Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">General Approach:</h4>
              <ul className="text-sm space-y-1">
                <li>• Read the problem carefully and understand the constraints</li>
                <li>• Think about edge cases (empty input, single element, etc.)</li>
                <li>• Start with a brute force solution, then optimize</li>
                <li>• Consider time and space complexity</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Common Patterns:</h4>
              <ul className="text-sm space-y-1">
                <li>• Two Pointers: For array problems with sorted data</li>
                <li>• Hash Map: For O(1) lookups and counting</li>
                <li>• Recursion: For tree and divide-and-conquer problems</li>
                <li>• Binary Search: For sorted arrays and search spaces</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
