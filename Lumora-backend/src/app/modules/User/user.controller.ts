import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { userServices } from "./user.service";

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;

  const result = await userServices.getMyProfile(user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "My profile data fetched!",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;

  const result = await userServices.updateMyProfile(user.id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Profile updated successfully!",
    data: result,
  });
});

const getALlUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getALlUser();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Get all User successfully!",
    data: result,
  });
});

const getDashboard = catchAsync(async (_req: Request, res: Response) => {
  const result = await userServices.getDashboard();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Dashboard data fetched successfully!",
    data: result,
  });
});

const getAuthors = catchAsync(async (_req: Request, res: Response) => {
  const result = await userServices.getAuthors();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Authors fetched successfully!",
    data: result,
  });
});

const getVerifiedAuthors = catchAsync(async (_req: Request, res: Response) => {
  const result = await userServices.getVerifiedAuthors();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Verified authors fetched successfully!",
    data: result,
  });
});

const toggleFollow = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.toggleFollow(
    String(req.params.id),
    req.user!.id,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.following ? "Author followed" : "Author unfollowed",
    data: result,
  });
});

const getFollowStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getFollowStatus(
    String(req.params.id),
    req.user!.id,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Follow status fetched",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.deleteUser(String(req.params.id));

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User deleted successfully!",
    data: result,
  });
});

const applyForAuthor = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.applyForAuthor(req.user!.id);
  sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Author application submitted", data: result });
});

const getAuthorApplications = catchAsync(async (_req: Request, res: Response) => {
  const result = await userServices.getAuthorApplications();
  sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Author applications fetched", data: result });
});

const reviewAuthorApplication = catchAsync(async (req: Request, res: Response) => {
  const decision = String(req.body.decision || "").toUpperCase();
  if (decision !== "APPROVED" && decision !== "REJECTED") {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Decision must be APPROVED or REJECTED" });
  }
  const result = await userServices.reviewAuthorApplication(String(req.params.id), decision);
  sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: `Author application ${decision.toLowerCase()}`, data: result });
});

export const userController = {
  getMyProfile,
  updateMyProfile,
  getALlUser,
  getDashboard,
  getAuthors,
  getVerifiedAuthors,
  toggleFollow,
  getFollowStatus,
  deleteUser,
  applyForAuthor,
  getAuthorApplications,
  reviewAuthorApplication,
};
