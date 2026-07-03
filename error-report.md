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

---

## Login Page Fixes

### Fix 1: Password Input Pre-filled with Placeholder Text

#### What Was Wrong
The `passwordInput` state in `src/App.tsx` was initialized with the string `"••••••••"`:
```typescript
// ❌ Before
const [passwordInput, setPasswordInput] = useState("••••••••");
```
This meant the actual bullet characters were set as the value of the password field, not just visual placeholder text. A user clicking the field would need to manually clear it before typing their real password — a confusing UX issue.

#### Fix Applied
Changed the initial value to an empty string:
```typescript
// ✅ After
const [passwordInput, setPasswordInput] = useState("");
```
The HTML `placeholder` attribute on the `<input>` already shows `"••••••••"` as greyed-out hint text when the field is empty, so the visual experience is identical — but now the field is actually empty and ready to type into immediately.

---

### Fix 2: Social Login Buttons Wired to Real OAuth

#### What Was Wrong
Both social login buttons (Google and Apple) were fake bypasses that skipped authentication entirely:
```typescript
// ❌ Before — no real auth, just forced the user in
onClick={() => setUser((p) => ({ ...p, loggedIn: true }))}
```
This meant any user could click them and gain access without a real identity.

The "Create an account" link in the footer had the same problem — it also bypassed auth.

#### Fix Applied

**Replaced Apple with Microsoft** (Apple OAuth requires a paid Apple Developer account; Microsoft/Azure is freely available).

**Added `handleOAuthLogin` function** in `src/App.tsx`:
```typescript
const handleOAuthLogin = async (provider: 'google' | 'azure') => {
  const key = provider === 'azure' ? 'microsoft' : 'google';
  setIsOAuthLoading(key);
  setAuthMessage(null);
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
    // Browser redirects to provider — onAuthStateChange handles the rest
  } catch (error: any) {
    setAuthMessage({ type: 'error', text: error.message || `${key} sign-in failed` });
    setIsOAuthLoading(null);
  }
};
```

**Added `isOAuthLoading` state** to show a per-button spinner while redirecting and disable both buttons to prevent double-clicks:
```typescript
const [isOAuthLoading, setIsOAuthLoading] = useState<'google' | 'microsoft' | null>(null);
```

**Fixed "Create an account" footer link** to properly switch to the Sign Up form instead of bypassing auth:
```typescript
// ✅ After
onClick={() => { setIsSignUp(true); setAuthMessage(null); }}
```

#### How the OAuth Flow Works
1. User clicks **Google** or **Microsoft**
2. Button shows spinner; the other button is disabled
3. `supabase.auth.signInWithOAuth()` redirects the browser to the provider's consent screen
4. After the user approves, the provider redirects back to `window.location.origin` (your app)
5. The existing `onAuthStateChange` listener in `useEffect` detects the new session and sets `loggedIn: true` automatically

#### ⚠️ Required Supabase Dashboard Setup (One-Time)
The code is complete, but these providers must be enabled in the Supabase dashboard before they will work:

| Step | Location | Action |
|---|---|---|
| 1 | supabase.com → Project → **Authentication → Providers** | Enable **Google**, paste Client ID & Secret from [console.cloud.google.com](https://console.cloud.google.com) |
| 2 | Same page | Enable **Azure (Microsoft)**, paste Client ID & Secret from [portal.azure.com](https://portal.azure.com) |
| 3 | supabase.com → Project → **Authentication → URL Configuration** | Add `http://localhost:5173` to **Redirect URLs** |

### Result
Both OAuth buttons now trigger real Supabase provider authentication. The password field is empty by default. The "Create an account" link correctly opens the Sign Up form. Authentication can no longer be bypassed from the login screen.
