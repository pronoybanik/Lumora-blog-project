import config from "../../config";
import { prisma } from "../../lib/prisma";
import ApiError from "../../Errors/ApiError";
import { StatusCodes } from "http-status-codes";

const plans = {
  monthly: { amount: config.ssl.monthlyAmount, days: 30 },
  yearly: { amount: config.ssl.yearlyAmount, days: 365 },
} as const;

type Plan = keyof typeof plans;

const getPlan = (value: unknown) => {
  if (value !== "monthly" && value !== "yearly") {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Choose a valid premium plan");
  }
  return plans[value as Plan];
};

const initiatePayment = async (user: { id: string; email: string; name?: string }, planName: unknown) => {
  const plan = getPlan(planName);
  if (!config.ssl.storeId || !config.ssl.storePassword) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Payment gateway is not configured");
  }

  const transactionId = `LUMORA-${user.id.slice(0, 8)}-${Date.now()}`;
  await prisma.payment.create({
    data: {
      userId: user.id,
      transactionId,
      plan: String(planName),
      amount: plan.amount,
    },
  });

  const form = new URLSearchParams({
    store_id: config.ssl.storeId,
    store_passwd: config.ssl.storePassword,
    total_amount: plan.amount,
    currency: "BDT",
    tran_id: transactionId,
    success_url: config.ssl.successUrl,
    fail_url: config.ssl.failedUrl,
    cancel_url: config.ssl.cancelUrl,
    ipn_url: config.ssl.successUrl,
    product_name: `Lumora Premium ${String(planName)}`,
    product_category: "Subscription",
    product_profile: "general",
    cus_name: user.name || "Lumora reader",
    cus_email: user.email,
    cus_add1: "Bangladesh",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    shipping_method: "NO",
    num_of_item: "1",
  });

  const response = await fetch(config.ssl.paymentApi, { method: "POST", body: form });
  const result = await response.json() as { GatewayPageURL?: string; status?: string; failedreason?: string };
  if (!response.ok || !result.GatewayPageURL) {
    await prisma.payment.update({ where: { transactionId }, data: { status: "FAILED", gatewayResponse: result } });
    throw new ApiError(StatusCodes.BAD_GATEWAY, result.failedreason || "Unable to start payment");
  }
  return { gatewayUrl: result.GatewayPageURL, transactionId };
};

const activateFromGateway = async (payload: Record<string, unknown>) => {
  const transactionId = String(payload.tran_id || "");
  const validationId = String(payload.val_id || "");
  const payment = await prisma.payment.findUnique({ where: { transactionId } });
  if (!payment || !validationId) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid payment transaction");
  if (payment.status === "PAID") return payment;

  const validationUrl = new URL(config.ssl.validationApi);
  validationUrl.searchParams.set("val_id", validationId);
  validationUrl.searchParams.set("store_id", config.ssl.storeId || "");
  validationUrl.searchParams.set("store_passwd", config.ssl.storePassword || "");
  validationUrl.searchParams.set("format", "json");
  const validationResponse = await fetch(validationUrl);
  const validation = await validationResponse.json() as { status?: string; tran_id?: string; amount?: string; currency?: string };
  const valid = validation.status === "VALID" || validation.status === "VALIDATED";
  if (!valid || validation.tran_id !== transactionId || Number(validation.amount) !== Number(payment.amount) || validation.currency !== payment.currency) {
    await prisma.payment.update({ where: { transactionId }, data: { status: "FAILED", validationId, gatewayResponse: validation } });
    throw new ApiError(StatusCodes.BAD_REQUEST, "Payment validation failed");
  }

  const plan = getPlan(payment.plan);
  const now = new Date();
  const subscription = await prisma.subscription.create({
    data: {
      userId: payment.userId,
      plan: payment.plan,
      startsAt: now,
      expiresAt: new Date(now.getTime() + plan.days * 24 * 60 * 60 * 1000),
    },
  });
  return prisma.payment.update({
    where: { transactionId },
    data: { status: "PAID", validationId, subscriptionId: subscription.id, gatewayResponse: validation },
  });
};

const getStatus = async (userId: string) => {
  const subscription = await prisma.subscription.findFirst({ where: { userId, status: "ACTIVE", expiresAt: { gt: new Date() } }, orderBy: { expiresAt: "desc" } });
  return { active: Boolean(subscription), subscription };
};

const markPaymentStatus = async (payload: Record<string, unknown>, status: "FAILED" | "CANCELLED") => {
  const transactionId = String(payload.tran_id || "");
  if (!transactionId) return;
  await prisma.payment.updateMany({
    where: { transactionId, status: "INITIATED" },
    data: { status },
  });
};

export const paymentServices = { initiatePayment, activateFromGateway, getStatus, markPaymentStatus };
