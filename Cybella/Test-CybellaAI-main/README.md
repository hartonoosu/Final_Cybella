
# 🧠 CybellaAI – AI-Powered Voice Therapy Assistant

CybellaAI is a responsive, web-based therapy assistant that leverages facial emotion recognition and voice analysis to simulate empathetic conversations. Designed to provide emotional support, Cybella bridges AI, emotion detection, and mental wellness in one powerful tool.

## 🌟 Features

- 🎭 **Real-Time Facial Emotion Detection** (using `face-api.js`)
- 🗣️ **Voice Transcription & Synthesis** via Web Speech API
- 📊 **Combined Emotion Dashboard** from both face and voice
- 🔊 **Text-to-Speech AI Responses**
- 📱 Fully **Responsive UI** (Mobile + Desktop)
- ⚡ Built with **React + Vite + TailwindCSS**

---

## 🚀 Live Demo

🔗 [GitHub Pages Deployment](https://Gajerarishi.github.io/Test-CybellaAI)

---

## 🧑‍💻 Tech Stack

| Frontend | Emotion Detection | Styling & UI | Build Tools |
|----------|-------------------|---------------|-------------|
| React    | face-api.js       | TailwindCSS, shadcn/ui | Vite, TypeScript |

---

## 📦 Installation

Make sure you have **Node.js (v18+)** and **npm** installed.

```bash
git clone https://github.com/GajeraRishi/Test-CybellaAI.git
cd Pro-CybellaAI
npm install
npm run dev
```

Then open your browser at [http://localhost:5173](http://localhost:5173)

---

## 🗃️ Project Structure

```bash
├── public/                  # Public assets like model files
├── src/
│   ├── components/          # React UI Components
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   └── main.tsx            # Entry point
├── index.html               # Root HTML
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind setup
```

---

## ✅ GitHub Pages Deployment Guide (for Vite Projects)

### 🔧 Step 1: Update `Git Setup for Deployment` 

If this is your first time setting up Git:

```bash
git init
git remote remove origin 
git remote add origin https://github.com/GajeraRishi/Test-Cybella.git
git add .
git commit -m "initial commit"
git branch -M main
git push -u origin main
```

### 🔧 Step 2: Update `package.json`

Make sure your `package.json` has the correct `homepage` and deployment scripts.

```json
{
  "homepage": "https://yourusername.github.io/repo-name/index.html",


  "scripts": {
    "postbuild": "rimraf dist/404.html && copyfiles -f -u 1 dist/index.html dist/404.html",
    "predeploy": "npm run build && npm run postbuild",
    "deploy": "npx gh-pages -d dist"
  }
}
```

Replace:
- `yourusername` with your GitHub username
- `repo-name` with your repository name

---

### 🛠️ Step 3: Install required packages

```bash
npm install --save-dev gh-pages copyfiles rimraf
```

---

### ⚙️ Step 4: Configure `vite.config.ts`

Update your `vite.config.ts` to include the `base` option:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/repo-name/', // Replace with your repo name
  plugins: [react()],
})
```

If you are deploying to a **custom domain** or from the root (not a subdirectory), update your `vite.config.ts` as follows:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use "/" if deploying to root or a custom domain
  base: "/",
  server: {
    host: "::",
    port: 5173, // specific port for vite localhost
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(), // Optional: development tagger
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
}));
```

This ensures assets are correctly served from the root of your domain or hosting environment.

---

### 🚀 Step 5: Deploy to GitHub Pages

1. Push your project to a public GitHub repository.
2. Run the following command to deploy:

```bash
npm run deploy
```

GitHub Pages will now serve your site from:
```
https://yourusername.github.io/repo-name/index.html
```

---

## 🔒 Permissions Required

- **Microphone**
- **Camera** (for facial analysis)
> Ensure your deployment uses HTTPS (camera/mic will not work otherwise)

---

## 🧪 Known Issues

- Firefox may have limited Speech API support
- Voice emotion detection is currently simulated
- Webcam access may be blocked if served over HTTP

---


## 🤝 Contributors 
- Team CybellaAI – Developing, UI/UX, Research, Testing

---


## 🧾 Alternative Manual Deployment

If you encounter the error:
```
"remote.origin.url" is not defined
```
Use the manual deploy command:

```bash
npx gh-pages -d dist -r "https://github.com/yourusername/your-repo-name.git"
```

Replace `"yourusername"` and `"your-repo-name"` accordingly.

---

