import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { userServices } from "./user.service";

const getMyProfile = catchAsync(async (req: Request, res: Response) => {

    const user = req.user!;


    console.log("suer token", user)

    const result = await userServices.getMyProfile(user);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "My profile data fetched!",
        data: result
    })
});

export const userController ={
    getMyProfile
}