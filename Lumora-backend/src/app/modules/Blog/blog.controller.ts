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

const getBlogs = catchAsync(async (req: Request, res: Response) => {
  const result = await blogServices.getBlogs(String(req.query.search || ""));
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Blogs fetched successfully!",
    data: result,
  });
});

const getMyBlogs = catchAsync(async (req: Request, res: Response) => {
  const result = await blogServices.getMyBlogs(req.user!);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Your blogs fetched successfully!",
    data: result,
  });
});

const getBlogBySlug = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const result = await blogServices.getBlogBySlug(slug, req.user?.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Blog fetched successfully!",
    data: result,
  });
});

const getBlogById = catchAsync(async (req: Request, res: Response) => {
  const result = await blogServices.getBlogById(String(req.params.id), req.user?.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Blog fetched successfully!",
    data: result,
  });
});

const toggleLike = catchAsync(async (req: Request, res: Response) => {
  const result = await blogServices.toggleLike(
    String(req.params.slug),
    req.user!.id,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.liked ? "Blog liked" : "Blog unliked",
    data: result,
  });
});

const toggleLikeById = catchAsync(async (req: Request, res: Response) => {
  const result = await blogServices.toggleLikeById(String(req.params.id), req.user!.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.liked ? "Blog liked" : "Blog unliked",
    data: result,
  });
});

const getLikeStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await blogServices.getLikeStatus(
    String(req.params.slug),
    req.user!.id,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Like status fetched",
    data: result,
  });
});

const getLikeStatusById = catchAsync(async (req: Request, res: Response) => {
  const result = await blogServices.getLikeStatusById(String(req.params.id), req.user!.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Like status fetched",
    data: result,
  });
});

const createComment = catchAsync(async (req: Request, res: Response) => {
  const result = await blogServices.createComment(
    String(req.params.slug),
    req.user!.id,
    req.body.content,
    req.body.parentId,
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Comment added successfully",
    data: result,
  });
});

const createCommentById = catchAsync(async (req: Request, res: Response) => {
  const result = await blogServices.createCommentById(
    String(req.params.id),
    req.user!.id,
    req.body.content,
    req.body.parentId,
  );
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Comment added successfully",
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

const updateBlogById = catchAsync(async (req: Request, res: Response) => {
  const result = await blogServices.updateBlogById(
    String(req.params.id),
    req.body,
    req.user!,
  );
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

const deleteBlogById = catchAsync(async (req: Request, res: Response) => {
  await blogServices.deleteBlogById(String(req.params.id), req.user!);
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
  getMyBlogs,
  getBlogBySlug,
  getBlogById,
  toggleLike,
  toggleLikeById,
  getLikeStatus,
  getLikeStatusById,
  createComment,
  createCommentById,
  updateBlog,
  deleteBlog,
  updateBlogById,
  deleteBlogById,
};
