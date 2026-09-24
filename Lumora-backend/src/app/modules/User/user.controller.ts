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

const getAuthors = catchAsync(async (_req: Request, res: Response) => {
  const result = await userServices.getAuthors();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Authors fetched successfully!",
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

export const userController = {
  getMyProfile,
  updateMyProfile,
  getALlUser,
  getAuthors,
  toggleFollow,
  getFollowStatus,
  deleteUser,
};
