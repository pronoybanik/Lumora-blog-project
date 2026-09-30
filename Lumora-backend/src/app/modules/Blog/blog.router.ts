import express from "express";
import auth from "../../middlewares/auth";
import { blogController } from "./blog.controller";
import optionalAuth from "../../middlewares/optionalAuth";

const router = express.Router();

router.get("/", blogController.getBlogs);
router.get("/my", auth(), blogController.getMyBlogs);
router.get("/:id/like", auth(), blogController.getLikeStatusById);
router.post("/:id/like", auth(), blogController.toggleLikeById);
router.post("/:id/comments", auth(), blogController.createCommentById);
router.patch("/:id", auth(), blogController.updateBlogById);
router.delete("/:id", auth(), blogController.deleteBlogById);
router.get("/:id", optionalAuth, blogController.getBlogById);
router.post("/", auth(), blogController.createBlog);

export const BlogRouter = router;
