# ⚡ PromptForge AI — Production MERN AI Prompt Generator

A modern, production-ready fullstack web application built on the **MERN** stack that transforms high-level topics into battle-tested, structured system prompts tailored for specialized roles (Developers, Marketers, Writers, Researchers, Product Managers, and Executives).

Designed adhering strictly to modern security standards (**Rule 2: Safety**) and fluid, state-of-the-art UX principles (**Rule 1: Fluidity**).

---

## 🚀 Key Features

### 🎨 1. Fluidity & Modern UI/UX (Frontend)
- **Framer Motion Animations**: Smooth page transitions, layout spring physics on persona selection, and animated toast notifications.
- **Glassmorphic Design System**: Dark-mode-first aesthetic with blur layers, ambient lighting orbs, and curated gradients built on **Tailwind CSS**.
- **1-Click Copy with Visual Checkmark**: Seamless clipboard integration with interactive checkmark feedback and toast notification.
- **Auto-Expanding Input**: Smart textarea dynamically scales in height as you type with live character counter (up to 500 characters) and quick sample injectors.
- **Shimmering Skeleton Loader**: Realistic gradient placeholder while waiting for prompt synthesis to ensure zero UI freezing.
- **Dual Output Views**: Toggle between clean **Formatted Preview** and raw **System Prompt** with 1-click markdown download (`.md`).
- **Prompt History Feed**: Synced history view to load, copy, and manage previous prompts.

### 🛡️ 2. Safety & Security Hardened (Backend)
- **Rate Limiting**: Configured with `express-rate-limit` to restrict `/api/generate` requests to a maximum of **10 requests per minute per IP**, preventing spam and compute denial.
- **HTTP Security Headers**: Uses `helmet` with custom content security policies.
- **Input Validation & Sanitization**: Strict validation using `express-validator` across all incoming parameters (`topic`, `persona`, `tone`, etc.).
- **NoSQL Injection Defense**: Integrated `express-mongo-sanitize` to strip `$` and `.` operators from client inputs.
- **Controlled CORS Policy**: Whitelists frontend origin (`http://localhost:5173`) with custom cross-origin headers.
- **Resilient MongoDB Fallback**: Gracefully handles offline database connections with an automatic in-memory cache, so the application runs immediately without crashing.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Security** | Helmet, Express-Rate-Limit, Express-Validator, Express-Mongo-Sanitize, CORS |
| **Dev Tools** | Concurrently, Nodemon |

---

## 📁 Project Structure

```text
├── package.json              # Root package config with concurrent runner scripts
├── .gitignore                # Workspace git ignore
├── README.md                 # Project documentation
│
├── client/                   # Frontend React + Vite Application
│   ├── index.html            # HTML entry point with Google Fonts
│   ├── package.json          # Client dependencies (React, Tailwind, Framer Motion)
│   ├── vite.config.js        # Vite config with API reverse proxy
│   ├── tailwind.config.js    # Tailwind color tokens & glassmorphism theme
│   ├── postcss.config.js     # PostCSS plugins
│   └── src/
│       ├── main.jsx          # React DOM root
│       ├── App.jsx           # Main application state & view routing
│       ├── index.css         # Tailwind base styles, glass classes & animations
│       ├── services/
│       │   └── api.js        # API client for backend communication
│       └── components/
│           ├── Navbar.jsx    # Sticky navigation with live API/DB status
│           ├── Hero.jsx      # Animated hero banner with feature highlights
│           ├── PersonaSelector.jsx # Persona cards with spring layout physics
│           ├── PromptForm.jsx# Input form with auto-expanding textarea
│           ├── PromptOutput.jsx # Glassmorphic output card with copy checkmark
│           ├── SkeletonLoader.jsx # Shimmering skeleton loading state
│           ├── HistoryFeed.jsx # MongoDB synced history list
│           ├── Toast.jsx     # Floating toast notifications
│           └── Footer.jsx    # Security badges & footer details
│
└── server/                   # Backend Express & MongoDB Application
    ├── package.json          # Server dependencies & run scripts
    ├── server.js             # Express server setup with security middlewares
    ├── .env.example          # Environment variable template
    ├── .env                  # Active environment variables
    ├── config/
    │   └── db.js             # MongoDB connection manager with offline fallback
    ├── models/
    │   └── Prompt.js         # Mongoose Schema with indexes & validation
    ├── services/
    │   └── promptEngine.js   # Prompt synthesizer with persona guardrails
    ├── controllers/
    │   └── promptController.js # Endpoint logic (generate, save, history, delete)
    ├── routes/
    │   └── api.js            # Express API routes with express-validator
    └── middleware/
        ├── rateLimiter.js    # Strict generate limiter (10/min) & API limiter
        └── errorHandler.js   # Centralized error handler & 404 catcher
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher) and **npm**
- *(Optional)* **MongoDB** running locally on `mongodb://localhost:27017` or a MongoDB Atlas URI. *(If MongoDB is not running, the application will automatically activate in-memory mode so you can test immediately without interruptions).*

---

### 2. Installation

From the project root directory, install dependencies for all parts:

```bash
# 1. Install root dependencies (concurrently)
npm install

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd ../client
npm install

# 4. Return to root
cd ..
```

*Alternatively, run the automated setup script:*
```bash
npm run setup
```

---

### 3. Environment Setup

The backend comes pre-configured with a `.env` file in the `/server` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai_prompt_generator
CLIENT_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10
```

---

### 4. Running Concurrently (Recommended)

To start **both** the backend Express server (`http://localhost:5000`) and the Vite React frontend (`http://localhost:5173`) simultaneously with unified colored logs:

```bash
npm run dev
```

Then open your browser to **`http://localhost:5173`**.

---

### 5. Running Individually

If you prefer running the servers in separate terminals:

#### Terminal 1 — Backend:
```bash
cd server
npm run dev
# Starts server at http://localhost:5000 with nodemon
```

#### Terminal 2 — Frontend:
```bash
cd client
npm run dev
# Starts Vite client at http://localhost:5173
```

---

## 📡 API Reference

### 1. Generate Optimized Prompt
- **Endpoint**: `POST /api/generate`
- **Rate Limit**: Max 10 requests / minute per IP
- **Request Body**:
```json
{
  "topic": "Implement an event-driven architecture using Apache Kafka and NestJS",
  "persona": "Developer",
  "tone": "Comprehensive & Actionable",
  "outputFormat": "Structured Markdown"
}
```
- **Response `(200 OK)`**:
```json
{
  "success": true,
  "data": {
    "topic": "Implement an event-driven architecture using Apache Kafka and NestJS",
    "persona": "Developer",
    "personaTitle": "Principal Software Architect & Lead Fullstack Engineer",
    "tone": "Comprehensive & Actionable",
    "outputFormat": "Structured Markdown",
    "generatedPrompt": "...",
    "tags": ["#SoftwareEngineering", "#Architecture", "#CleanCode", "#ProductionReady"],
    "tokensEstimate": 284,
    "generatedAt": "2026-09-29T13:45:00.000Z"
  }
}
```

### 2. Save Prompt to History
- **Endpoint**: `POST /api/save`
- **Request Body**:
```json
{
  "topic": "Implement an event-driven architecture",
  "persona": "Developer",
  "generatedPrompt": "...",
  "tokensEstimate": 284,
  "tags": ["#Architecture"]
}
```
- **Response `(201 Created)`**:
```json
{
  "success": true,
  "message": "Prompt saved to database successfully",
  "data": { "_id": "...", "topic": "..." }
}
```

### 3. Get Recent History
- **Endpoint**: `GET /api/history`
- **Response `(200 OK)`**: Returns latest 10 generated prompts.

### 4. Delete Prompt
- **Endpoint**: `DELETE /api/history/:id`
- **Response `(200 OK)`**: Removes specified prompt from library.

### 5. Health Check
- **Endpoint**: `GET /api/health`
- **Response `(200 OK)`**:
```json
{
  "status": "healthy",
  "timestamp": "2026-09-29T13:45:00.000Z",
  "database": "connected",
  "uptimeSeconds": 128
}
```

---

## 🔒 Verification & Security Checklist

- [x] **Rate Limiting**: Tested and enforced with `express-rate-limit` returning 429 when limits are reached.
- [x] **NoSQL Injection**: Protected with `express-mongo-sanitize` stripping malicious MongoDB query selectors.
- [x] **HTTP Headers**: Enforced via `helmet` protecting against clickjacking, XSS, and sniffing.
- [x] **Input Validation**: Strict type, length, and enum checks on all routes via `express-validator`.
- [x] **CORS**: Restricted strictly to frontend port `5173`.
