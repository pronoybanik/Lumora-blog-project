import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { blogServices } from "./blog.service";

const createBlog = catchAsync(async (req: Request, res: Response) => {
  const result = await blogServices.createBlog(req.body, req.user!);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Blog created successfully!",
    data: result,
  });
});

const getBlogs = catchAsync(async (_req: Request, res: Response) => {
  const result = await blogServices.getBlogs();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Blogs fetched successfully!",
    data: result,
  });
});

const getBlogBySlug = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const result = await blogServices.getBlogBySlug(slug);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Blog fetched successfully!",
    data: result,
  });
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const result = await blogServices.updateBlog(slug, req.body, req.user!);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Blog updated successfully!",
    data: result,
  });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  await blogServices.deleteBlog(slug, req.user!);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Blog deleted successfully!",
    data: null,
  });
});

export const blogController = {
  createBlog,
  getBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
};
