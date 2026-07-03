# Error Report & Resolution

## The Error
When running the application, you encountered a crash/error screen. This was caused by a TypeScript compilation error in the Vite environment:

```text
src/supabaseClient.ts(3,33): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
```

## Why it Happened
Vite uses a special syntax (`import.meta.env`) to access environment variables like your Supabase URL and Key from the `.env` file. However, TypeScript didn't know what `import.meta.env` was because it didn't have the specific Vite client types loaded. This caused the compiler to throw an error and break the app.

Additionally, because the development server was already running *before* we created the `.env` file, Vite hadn't loaded those new variables yet.

## How I Fixed It
1. **Added TypeScript Definitions:** I created a new file called `src/vite-env.d.ts` and added the following line of code to it:
   ```typescript
   /// <reference types="vite/client" />
   ```
   This tells TypeScript: "Hey, we are in a Vite environment, so `import.meta.env` is perfectly valid." This completely cleared the compilation error.

2. **Server Restart Requirement:** To ensure the `.env` variables are successfully loaded, the local development server must be restarted. If you haven't already, please kill your current terminal process (Ctrl+C) and run `npm run dev` again.

## Running the App Easily (`start.bat`)
To make restarting and running your application much easier, I have created a `start.bat` file in the root folder.

### What it does:
- It automatically opens a terminal window and runs the `npm run dev` command for you.
- It provides a handy reminder about your Supabase keys.
- It prevents the window from closing immediately if an error occurs, allowing you to read the error message.

### How to use it:
Instead of opening a terminal and typing commands, you can now simply **double-click the `start.bat` file** in your file explorer anytime you want to launch the EduFlow AI Tutor locally!

---

## Architecture Update: Separating Frontend and Backend
To make the application more robust and closely align with modern microservice patterns, the frontend (Vite React) and backend (Express) have been completely separated for local development.

### How this was achieved:
1. **Removed Vite Middleware from `server.ts`:** The backend server (`server.ts`) was completely stripped of Vite dependencies. It is now a pure API server that runs isolated on port `3001`.
2. **Configured Vite Proxy (`vite.config.ts`):** I updated the Vite configuration to start its own blazing-fast server (usually on port `5173`) and added a proxy. Any request the frontend makes to `/api` is automatically forwarded to the backend running on `3001`. This completely eliminates CORS issues during development.
3. **Updated Package Scripts (`package.json`):** 
   - Installed `npm-run-all` to run multiple commands at the same time.
   - Separated the scripts into `dev:frontend` and `dev:backend`.
   - The main `npm run dev` script now triggers both of these concurrently.

This means when you run `start.bat`, it spins up two distinct processes side-by-side, perfectly separating your user interface layer from your database/logic layer!

---

## TypeScript Red Lines in `server.ts` (Fixed)

### What Were the Red Lines?

The TypeScript language server was showing red squiggly underlines on the first three import lines of `server.ts`:

```typescript
import express from "express";       // ❌ Line 1 — red line
import path from "path";             // ❌ Line 2 — red line
import { fileURLToPath } from "url"; // ❌ Line 3 — red line
```

And on line 5:
```typescript
const __filename = fileURLToPath(import.meta.url); // ❌ red line
```

### Root Cause

The project only had one `tsconfig.json`, and it was configured **entirely for the Vite/browser frontend**. The `server.ts` backend file was being type-checked against it, causing conflicts:

| Setting in `tsconfig.json` | Problem for `server.ts` |
|---|---|
| `"moduleResolution": "bundler"` | Vite-only mode — not valid for Node.js. Breaks resolution of `express`, `path`, `url`. |
| `"lib": ["ES2022", "DOM", "DOM.Iterable"]` | DOM libs are browser-only. Not appropriate for a server environment. |
| `"isolatedModules": true` | A Vite requirement that doesn't apply to the backend. |
| No `"types": ["node"]` entry | TypeScript didn't know about Node.js globals like `process.env`, `import.meta.url` (Node variant). |

In short: **one tsconfig was trying to serve both the browser frontend and the Node.js backend — which are incompatible environments.**

### Fix Applied

#### 1. Created `tsconfig.server.json` (new file)
A dedicated TypeScript config for the backend only, using Node.js-appropriate settings:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "types": ["node"]
  },
  "include": ["server.ts"],
  "exclude": ["node_modules", "dist", "src"]
}
```

Key differences from `tsconfig.json`:
- `"moduleResolution": "node"` — correct for Node.js (not bundler)
- `"lib": ["ES2022"]` — no DOM, server has no browser APIs
- `"types": ["node"]` — loads `@types/node` so `process`, `path`, `url`, `import.meta.url` are all recognized
- `"include": ["server.ts"]` — scoped only to the server file

#### 2. Updated `package.json` Scripts

| Script | Before | After |
|---|---|---|
| `dev:backend` | `tsx server.ts` | `tsx --tsconfig tsconfig.server.json server.ts` |
| `build` | `esbuild server.ts ...` | `esbuild server.ts ... --tsconfig=tsconfig.server.json` |
| `lint` | `tsc --noEmit` | `tsc --noEmit && tsc --noEmit -p tsconfig.server.json` |

This ensures the backend is always compiled and type-checked with the correct Node.js config, while the frontend continues to use the original `tsconfig.json` for Vite.

### Result
The red lines in `server.ts` are resolved. The frontend and backend now have fully isolated TypeScript configurations suited to their respective environments.
