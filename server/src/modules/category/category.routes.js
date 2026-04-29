// modules/category/category.routes.js

import express from "express";
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "./category.controller.js";

import fileUpload from '../../utils/fileUpload.js'
// import { auth, authorizeRoles } from "../../middleware/auth.middleware.js";

const router = express.Router();

// 🔐 (optional)
// router.use(auth);

router.post(
  "/",
  fileUpload.single("image"), 
  // authorizeRoles("admin"),
  createCategory
);

router.get("/", getCategories);
router.get("/:id", getCategory);

router.put(
  "/:id",
  fileUpload.single("image"),
  // authorizeRoles("admin"),
  updateCategory
);

router.delete(
  "/:id",
  // authorizeRoles("admin"),
  deleteCategory
);

export default router;