import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { createTables } from "./db/schema";
import { seedDefaultAdmin } from "./models/users";
import { ensureConfigTable } from "./models/config";
import perfumesRouter from "./routes/perfumes";
import uploadsRouter from "./routes/uploads";
import staffRequestsRouter from "./routes/staffRequests";
import authRouter from "./routes/auth";
import adminRouter from "./routes/admin";
import configRouter from "./routes/config";
import { requireAuth } from "./middleware/auth";
import { errorHandler } from "./middleware/errorHandler";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ──────────────────────────────────────────────────────────────

// Allow your React frontend (localhost:5173) to call this server
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  }),
);

// Parse incoming JSON request bodies
app.use(express.json());

// Serve uploaded images as static files at /uploads/filename.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Database ────────────────────────────────────────────────────────────────

// Create tables on startup (safe to run every time — uses IF NOT EXISTS)
createTables();
seedDefaultAdmin();
ensureConfigTable();

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/perfumes", perfumesRouter);
app.use("/api/uploads", uploadsRouter);
app.use("/api/staff-requests", staffRequestsRouter);
app.use("/api/admin", adminRouter);
app.use("/api", configRouter);

// Health check — useful to confirm the server is running
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Error handler (must be LAST) ───────────────────────────────────────────

app.use(errorHandler);

// ─── Start ───────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
