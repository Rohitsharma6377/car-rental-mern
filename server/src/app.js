import express from "express";
import { authServices } from "./modules/auth/auth.services.js";
import authRoutes from "./modules/auth/auth.routes.js";

const app = express();

// ✅ MUST COME FIRST
app.use(express.json());
await authServices.ensureTable(); // Ensure the users table exists before handling any requests

// ✅ THEN routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("hello world");
});

export default app;