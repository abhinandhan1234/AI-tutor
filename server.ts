import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

  app.use(express.json());

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

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();