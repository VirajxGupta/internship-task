# PostStream — Full-Stack Posts Explorer

A modern full-stack web application that fetches posts from the JSONPlaceholder API, stores them in **MongoDB Atlas**, and displays them with **real-time WebSocket search**.

![PostStream](https://img.shields.io/badge/React-18-blue?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb) ![WebSocket](https://img.shields.io/badge/WebSocket-ws-orange)

## 🚀 Live URLs

- **Frontend (Vercel)**: _[Add after deployment]_
- **Backend API (Vercel)**: _[Add after deployment]_
- **WebSocket Server (Railway)**: _[Add after deployment]_

## 🏗️ Architecture

```
┌─────────────────┐     REST API     ┌─────────────────┐
│   React Frontend│───────────────▶│  Express Backend │
│  (Vite + Vercel)│                  │  (Vercel Serverless)│
│                 │                  │                 │
│                 │     WebSocket    │                 │
│                 │─────────────────▶│  WS Server      │
│                 │                  │  (Railway/Render)│
└─────────────────┘                  └────────┬────────┘
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │  MongoDB Atlas   │
                                     │  (Free Tier)     │
                                     └─────────────────┘
                                              ▲
                                              │ Fetch & Store
                                     ┌─────────────────┐
                                     │ JSONPlaceholder  │
                                     │ API              │
                                     └─────────────────┘
```

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React.js (Vite) | UI with real-time search |
| Backend | Node.js + Express | REST API |
| Database | MongoDB Atlas (Free Tier) | Data persistence |
| WebSocket | ws | Real-time search |
| External API | JSONPlaceholder | Posts data source |
| Deployment | Vercel + Railway | Hosting |

## 🗄️ MongoDB Atlas Setup

### 1. Create a free cluster

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas/register) → Sign up
2. Create a **Free Shared Cluster** (M0)
3. Choose a cloud provider & region

### 2. Configure access

1. **Database Access** → Add a database user with username & password
2. **Network Access** → Add `0.0.0.0/0` to allow connections from anywhere (needed for Vercel/Railway)

### 3. Get your connection string

1. Click **Connect** on your cluster → **Drivers** → Copy the connection string
2. Replace `<password>` with your database user's password
3. Add your database name (e.g. `posts-app`) before the `?` in the URI

Example: `mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/posts-app?retryWrites=true&w=majority`

## 📡 API Endpoints

### REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/posts/fetch` | Fetch posts from JSONPlaceholder & save to MongoDB |
| `GET` | `/api/posts` | Get all posts (supports `?page=1&limit=100`) |
| `GET` | `/api/posts/:id` | Get a single post by ID |
| `DELETE` | `/api/posts/:id` | Delete a post |
| `GET` | `/api/health` | Health check |

### WebSocket API

| Direction | Message | Payload |
|-----------|---------|---------|
| Client → Server | Search query | `{ "type": "search", "query": "search term" }` |
| Server → Client | Search results | `{ "type": "results", "query": "...", "posts": [...] }` |
| Server → Client | Error | `{ "type": "error", "message": "..." }` |

## 🏃 Running Locally

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier) — [create one here](https://www.mongodb.com/cloud/atlas/register)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd posts-fullstack-app
```

### 2. Set up environment variables

Copy the example `.env` files and fill in your values:

```bash
# Backend
cp backend/.env.example backend/.env

# WebSocket Server
cp websocket-server/.env.example websocket-server/.env

# Frontend
cp frontend/.env.example frontend/.env
```

**Required variables:**

| Variable | Location | Value |
|----------|----------|-------|
| `MONGODB_URI` | backend/.env, websocket-server/.env | Your MongoDB Atlas connection string |
| `PORT` | backend/.env | `5000` (default) |
| `FRONTEND_URL` | backend/.env | `http://localhost:5173` |
| `VITE_API_URL` | frontend/.env | `http://localhost:5000` |
| `VITE_WS_URL` | frontend/.env | `ws://localhost:5001` |

### 3. Install dependencies

```bash
npm run install:all
```

### 4. Start all services

```bash
npm run dev
```

This starts:
- **Backend** on `http://localhost:5000`
- **WebSocket Server** on `ws://localhost:5001`
- **Frontend** on `http://localhost:5173`

### 5. Load initial data

Click the **"⚡ Fetch Posts"** button in the UI, or hit the API directly:

```bash
curl -X POST http://localhost:5000/api/posts/fetch
```

## 📦 Deployment

### Frontend & Backend → Vercel

1. Push to GitHub
2. Import the repo in Vercel
3. For **frontend**: set root directory to `frontend`, framework to Vite
4. For **backend**: set root directory to `backend`, add `MONGODB_URI` env variable
5. Update `VITE_API_URL` in frontend to point to your deployed backend URL

### WebSocket Server → Railway

1. In Railway, create a new project → "Deploy from GitHub Repo"
2. Set root directory to `websocket-server`
3. Add `MONGODB_URI` as an environment variable
4. Railway will use the Dockerfile to build and deploy
5. Update `VITE_WS_URL` in your frontend to point to the Railway WebSocket URL (use `wss://`)

## 📁 Project Structure

```
├── backend/
│   ├── api/
│   │   └── index.js          # Vercel serverless entry
│   ├── models/
│   │   └── Post.js           # Mongoose Post schema
│   ├── routes/
│   │   └── posts.js          # REST API routes
│   ├── server.js             # Express app
│   ├── vercel.json           # Vercel config
│   └── package.json
│
├── websocket-server/
│   ├── index.js              # Standalone WS server
│   ├── Dockerfile            # For Railway deployment
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── PostList.jsx
│   │   │   └── PostDetail.jsx
│   │   ├── hooks/
│   │   │   ├── usePosts.js
│   │   │   └── useWebSocket.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vercel.json
│   └── package.json
│
├── .gitignore
├── package.json              # Root monorepo config
└── README.md
```

## ✨ Features

- **REST API** — 4+ endpoints for CRUD operations on posts
- **WebSocket** — Real-time search with debounced input
- **MongoDB Atlas** — Free tier cloud database with Mongoose ODM
- **Modern UI** — Dark theme with glassmorphism, gradient accents, and micro-animations
- **Responsive** — Mobile-first design (3-col → 2-col → 1-col grid)
- **Auto-seed** — One click to fetch & store 100 posts from JSONPlaceholder
- **Loading states** — Skeleton cards and spinners for better UX

## 📝 License

MIT
