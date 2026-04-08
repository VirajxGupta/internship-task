require('dotenv').config();
const http = require('http');
const { WebSocketServer } = require('ws');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.error('FATAL UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('FATAL UNHANDLED REJECTION:', reason);
});

// ── Mongoose Post Schema (standalone copy) ──
const postSchema = new mongoose.Schema(
  {
    userId: Number,
    id: { type: Number, unique: true },
    title: { type: String, index: true },
    body: String,
  },
  { timestamps: true }
);
postSchema.index({ title: 'text', body: 'text' });
const Post = mongoose.model('Post', postSchema);

// ── MongoDB Connection ──
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ WebSocket server connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// ── Search Handler ──
async function handleSearch(ws, query) {
  try {
    if (!query || query.trim() === '') {
      const posts = await Post.find().sort({ id: 1 }).limit(100);
      ws.send(JSON.stringify({ type: 'results', query: '', posts, count: posts.length }));
      return;
    }

    const searchRegex = new RegExp(query.trim(), 'i');
    const posts = await Post.find({
      $or: [{ title: searchRegex }, { body: searchRegex }],
    })
      .sort({ id: 1 })
      .limit(50);

    ws.send(JSON.stringify({ type: 'results', query, posts, count: posts.length }));
  } catch (error) {
    console.error('Search error:', error.message);
    ws.send(JSON.stringify({ type: 'error', message: 'Search failed. Please try again.' }));
  }
}

// ── HTTP Server (health check) ──
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'websocket-server' }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

// ── WebSocket Server ──
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('🔌 Client connected');

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      if (message.type === 'search') {
        await handleSearch(ws, message.query);
      } else {
        ws.send(JSON.stringify({ type: 'error', message: `Unknown message type: ${message.type}` }));
      }
    } catch (error) {
      console.error('Message parse error:', error.message);
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format.' }));
    }
  });

  ws.on('close', () => console.log('🔌 Client disconnected'));

  ws.send(JSON.stringify({ type: 'connected', message: 'Connected to Posts WebSocket Server' }));
});

// ── Start ──
const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🔌 WebSocket server running on ws://localhost:${PORT}`);
  });
});
