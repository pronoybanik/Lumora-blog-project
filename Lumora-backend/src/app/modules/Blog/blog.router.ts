import express from "express";
import auth from "../../middlewares/auth";
import { blogController } from "./blog.controller";

const router = express.Router();

router.get("/", blogController.getBlogs);
router.get("/:slug", blogController.getBlogBySlug);
router.post("/", auth(), blogController.createBlog);
router.patch("/:slug", auth(), blogController.updateBlog);
router.delete("/:slug", auth(), blogController.deleteBlog);

export const BlogRouter = router;
