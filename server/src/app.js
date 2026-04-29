import express from "express";
import { authServices } from "./modules/auth/auth.services.js";
import authRoutes from "./modules/auth/auth.routes.js";
import CategoryServices from "./modules/category/category.services.js";
import categoryRoutes from "./modules/category/category.routes.js";
import { globalRateLimiter } from "./middleware/rateLimiter.js";

const app = express();
app.use(globalRateLimiter)
// ✅ MUST COME FIRST
app.use(express.json());
await authServices.ensureTable(); // Ensure the users table exists before handling any requests
await CategoryServices.ensureTable(); // Ensure categories table exists

// ✅ THEN routes
app.use("/api/auth", authRoutes);
app.use("/api", categoryRoutes)

app.get("/", (req, res) => {
  res.send("hello world");
});

export default app;