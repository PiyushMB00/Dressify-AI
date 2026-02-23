# Dressify AI

Dressify AI is a fashion recommendation engine powered by AI.

## Project Structure

- **`client/`**: Frontend application (HTML, CSS, JS) and server.
- **`server/`**: Backend API (Node.js, Express, MongoDB).
- **`docs/`**: Project documentation (Guides, Checklists, Reports).

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally on default port 27017)

## Getting Started

### 1. Start the Backend API

Open a terminal and run:

```bash
cd server
npm install
npm start
```

The backend will start on **http://localhost:8000**.

### 2. Start the Frontend Application

Open a **new** terminal window and run:

```bash
cd client
npm install
node server.js
```

The frontend will start on **http://localhost:3000**.

## Documentation

For detailed guides, please refer to the `docs/` folder:

- **`docs/API_SETUP_GUIDE.md`**: Detailed backend setup.
- **`docs/AIHUB_QUICK_START.md`**: Guide for the AI Hub feature.
- **`docs/archive/`**: Archived documentation from previous versions.
