import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import config from "../../config";
import { paymentServices } from "./payment.service";

const initiate = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentServices.initiatePayment(req.user!, req.body.plan);
  sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Payment started", data: result });
});

const success = catchAsync(async (req: Request, res: Response) => {
  await paymentServices.activateFromGateway({ ...req.query, ...req.body });
  res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-success`);
});

const failed = catchAsync(async (req: Request, res: Response) => {
  await paymentServices.markPaymentStatus({ ...req.query, ...req.body }, "FAILED");
  res.redirect(config.ssl.failedUrl);
});
const cancel = catchAsync(async (req: Request, res: Response) => {
  await paymentServices.markPaymentStatus({ ...req.query, ...req.body }, "CANCELLED");
  res.redirect(config.ssl.cancelUrl);
});

const status = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentServices.getStatus(req.user!.id);
  sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Subscription status fetched", data: result });
});

export const paymentController = { initiate, success, failed, cancel, status };
