import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { authServices } from "./auth.service";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.createUser(req.body);

  console.log("register", req.body)

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Registered successfully!",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.loginUser(req.body);
  
//   const { refreshToken } = result;
  // res.cookie("refreshToken", refreshToken, {
  //     secure: false,
  //     httpOnly: true
  // })

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Logged in successfully!",
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
});

export const authController = {
  registerUser,
  loginUser,
};
