import express from "express";

const app = express();

// Parse JSON bodies
app.use(express.json());

// Chat API Endpoint
app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  const userMessage = typeof message === "string" ? message.trim() : "";
  const textLower = userMessage.toLowerCase();

  let responseText = "Thanks for your message! I am running in offline tutor mode and can help with study questions.";

  if (textLower.includes("recursion") || textLower.includes("base case") || textLower.includes("stack")) {
    responseText =
      "In offline tutor mode, recursion means a function calls itself to solve smaller parts of a problem. The base case stops the recursion, for example `if (n <= 1) return 1;`. Without a base case, it would keep calling itself forever.";
  } else if (textLower.includes("example") || textLower.includes("explain")) {
    responseText =
      "Here's a simple example of recursion:\n\nfunction fib(n) {\n  if (n <= 1) return n;\n  return fib(n - 1) + fib(n - 2);\n}\n\nThis computes Fibonacci numbers by reducing the problem size each call.";
  } else if (textLower.includes("quiz") || textLower.includes("test")) {
    responseText =
      "Let's turn this into a quick quiz! Which part of a recursive function prevents infinite calls? A) recursive case or B) base case?";
  }

  res.json({ text: responseText });
});

// Export the Express app as a serverless function for Vercel
export default app;
