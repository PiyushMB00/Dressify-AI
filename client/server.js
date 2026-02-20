const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "Frontend Server running",
    port: PORT,
    backends: {
      nodejs: "http://127.0.0.1:8000",
      python: "http://127.0.0.1:8001",
      flask_chat: "http://127.0.0.1:5000",
    },
  });
});

// Serve the AI Hub page on root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "ai-hub.html"));
});

// Alternative routes for different pages
app.get("/ai-hub", (req, res) => {
  res.sendFile(path.join(__dirname, "ai-hub.html"));
});

app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "gemini_chatbot.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║  🎨 Dressify AI Frontend Server               ║
╚═══════════════════════════════════════════════╝
✅ Server running on http://127.0.0.1:${PORT}
📄 Open http://127.0.0.1:${PORT} in your browser
🔗 Connected to:
   - Node Backend: http://127.0.0.1:8000
   - Python AI: http://127.0.0.1:8001
   - Flask Chat: http://127.0.0.1:5000
══════════════════════════════════════════════════
  `);
});
