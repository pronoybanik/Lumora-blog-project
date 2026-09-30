import express from "express";
import auth from "../../middlewares/auth";
import { categoryController } from "./category.controller";

const router = express.Router();

router.get("/", categoryController.getCategories);
router.post("/", auth("ADMIN"), categoryController.createCategory);
router.patch("/:id", auth("ADMIN"), categoryController.updateCategory);
router.delete("/:id", auth("ADMIN"), categoryController.deleteCategory);

export const CategoryRouter = router;
