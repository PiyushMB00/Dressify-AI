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
      nodejs: "http://localhost:8000",
      python: "http://localhost:8001",
      flask_chat: "http://localhost:5000",
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
✅ Server running on http://localhost:${PORT}
📄 Open http://localhost:${PORT} in your browser
🔗 Connected to:
   - Node Backend: http://localhost:8000
   - Python AI: http://localhost:8001
   - Flask Chat: http://localhost:5000
══════════════════════════════════════════════════
  `);
});
