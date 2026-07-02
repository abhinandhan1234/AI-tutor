import { CourseModule, QuizQuestion, RecentActivity } from "./types";

export const initialModules: CourseModule[] = [
  {
    id: "mod-1",
    title: "Foundations of Logic",
    level: "Easy",
    status: "completed",
    completedDate: "Completed on Oct 12"
  },
  {
    id: "mod-2",
    title: "Complexity Analysis",
    level: "Medium",
    status: "completed",
    completedDate: "Completed on Oct 15"
  },
  {
    id: "mod-3",
    title: "Data Structures - Intermediate (Adaptive)",
    level: "Medium",
    status: "active",
    info: "AI optimized for your performance in Trees & Graphs."
  },
  {
    id: "mod-4",
    title: "Dynamic Programming",
    level: "Hard",
    status: "locked",
    info: "Locked • Complete previous module"
  },
  {
    id: "mod-5",
    title: "System Architecture",
    level: "Hard",
    status: "locked",
    info: "Locked"
  }
];

export const initialQuestions: QuizQuestion[] = [
  {
    id: "q-1",
    text: "Which data structure uses LIFO?",
    options: ["Queue", "Stack", "Linked List", "Binary Tree"],
    correctOptionIndex: 1, // Stack
    level: "Hard (Adjusted)",
    hint: "Think about how items are added and removed from the collection in various architectural patterns."
  },
  {
    id: "q-2",
    text: "What is the worst-case time complexity of searching in a Hash Table?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctOptionIndex: 2, // O(n) (when all elements hash to the same bucket)
    level: "Medium (Adaptive)",
    hint: "Consider what happens if there are extreme collisions in your hash slots."
  },
  {
    id: "q-3",
    text: "Which algorithm is commonly used to find the shortest path in a weighted graph with negative edge weights?",
    options: ["Dijkstra's Algorithm", "Bellman-Ford Algorithm", "Kruskal's Algorithm", "Floyd-Warshall Algorithm"],
    correctOptionIndex: 1, // Bellman-Ford
    level: "Hard",
    hint: "Dijkstra's fails in negative weighted edges. This algorithm relaxes all edges |V| - 1 times."
  },
  {
    id: "q-4",
    text: "What does the 'A' in ACID transactions stand for?",
    options: ["Availability", "Atomicity", "Authority", "Agreement"],
    correctOptionIndex: 1, // Atomicity
    level: "Easy",
    hint: "It guarantees that either all database modifications are performed or none are."
  }
];

export const initialActivities: RecentActivity[] = [
  {
    id: "act-1",
    type: "quiz",
    title: "Linear Algebra Quiz",
    detail: "Scored 92% • 2h ago",
    time: "2h ago"
  },
  {
    id: "act-2",
    type: "chat",
    title: "AI Tutor Chat",
    detail: "Calculus help • 5h ago",
    time: "5h ago"
  },
  {
    id: "act-3",
    type: "module",
    title: "Data Structures",
    detail: "Completed Intro • Yesterday",
    time: "Yesterday"
  }
];

export const initialChatHistory = [
  {
    id: "msg-1",
    role: "model" as const,
    text: "Think of **Recursion** like a set of Matryoshka dolls. To solve a big problem, you open it up to find a smaller, identical problem inside. You keep going until you hit the smallest doll—the **base case**.",
    timestamp: "10:42 AM",
    isVisual: true
  },
  {
    id: "msg-2",
    role: "user" as const,
    text: "Can you explain recursion again? I'm still a bit confused about how the function \"stops\".",
    timestamp: "10:45 AM"
  },
  {
    id: "msg-3",
    role: "model" as const,
    text: "Great question! That's exactly where the **base case** comes in. Without it, the function would call itself forever. It's like having a condition that says \"If the doll is too small to open, stop here.\"",
    timestamp: "10:46 AM"
  }
];
