import express from "express";
import auth from "../../middlewares/auth";
import { paymentController } from "./payment.controller";

const router = express.Router();
router.post("/initiate", auth(), paymentController.initiate);
router.get("/status", auth(), paymentController.status);
router.post("/success", paymentController.success);
router.get("/success", paymentController.success);
router.post("/failed", paymentController.failed);
router.get("/failed", paymentController.failed);
router.post("/cancel", paymentController.cancel);
router.get("/cancel", paymentController.cancel);
export const PaymentRouter = router;
