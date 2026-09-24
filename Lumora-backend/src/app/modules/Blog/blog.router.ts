import express from "express";
import auth from "../../middlewares/auth";
import { blogController } from "./blog.controller";

const router = express.Router();

router.get("/", blogController.getBlogs);
router.get("/my", auth(), blogController.getMyBlogs);
router.get("/:slug", blogController.getBlogBySlug);
router.post("/", auth(), blogController.createBlog);
router.get("/:slug/like", auth(), blogController.getLikeStatus);
router.post("/:slug/like", auth(), blogController.toggleLike);
router.post("/:slug/comments", auth(), blogController.createComment);
router.patch("/:slug", auth(), blogController.updateBlog);
router.delete("/:slug", auth(), blogController.deleteBlog);

export const BlogRouter = router;
