import { BlogStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import ApiError from "../../Errors/ApiError";
import { StatusCodes } from "http-status-codes";

type AuthenticatedUser = {
  id: string;
  email: string;
  role: string;
};

type BlogPayload = {
  title: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  status?: BlogStatus;
};

const makeSlug = (title: string) =>
  title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "blog";

const getUniqueSlug = async (title: string, excludedId?: string) => {
  const baseSlug = makeSlug(title);
  let slug = baseSlug;
  let suffix = 1;

  while (
    await prisma.blog.findFirst({
      where: { slug, ...(excludedId ? { NOT: { id: excludedId } } : {}) },
    })
  ) {
    slug = `${baseSlug}-${suffix++}`;
  }

  return slug;
};

const getAuthor = async (user: AuthenticatedUser) =>
  prisma.user.findUniqueOrThrow({
    where: { email: user?.email },
    select: { id: true },
  });

const createBlog = async (payload: BlogPayload, user: AuthenticatedUser) => {
  console.log("user", user);
  const author = await getAuthor(user);
  const slug = await getUniqueSlug(payload.title);

  return prisma.blog.create({
    data: {
      title: payload.title,
      slug,
      excerpt: payload.excerpt,
      content: payload.content,
      coverImage: payload.coverImage,
      status: payload.status ?? BlogStatus.DRAFT,
      publishedAt: payload.status === BlogStatus.PUBLISHED ? new Date() : null,
      authorId: author.id,
    },
    include: { author: { select: { id: true, name: true, email: true } } },
  });
};

const getBlogs = async () =>
  prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { id: true, name: true, email: true } } },
  });

const getMyBlogs = async (user: AuthenticatedUser) =>
  prisma.blog.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true } },
      _count: { select: { comments: true, likes: true } },
    },
  });

const getBlogBySlug = async (slug: string) => {
  await prisma.blog.update({
    where: { slug },
    data: { viewCount: { increment: 1 } },
  });

  return prisma.blog.findUniqueOrThrow({
    where: { slug },
    include: {
      author: { select: { id: true, name: true } },
      comments: {
        where: { parentId: null },
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true } },
          replies: {
            orderBy: { createdAt: "asc" },
            include: { user: { select: { id: true, name: true } } },
          },
        },
      },
      _count: { select: { comments: true, likes: true } },
    },
  });
};

const createComment = async (
  slug: string,
  userId: string,
  content: string,
  parentId?: string,
) => {
  const blog = await prisma.blog.findUniqueOrThrow({ where: { slug } });
  const trimmedContent = content?.trim();

  if (!trimmedContent) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Comment cannot be empty");
  }

  if (parentId) {
    const parent = await prisma.comment.findFirst({
      where: { id: parentId, blogId: blog.id },
    });
    if (!parent) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Parent comment not found");
    }
  }

  return prisma.comment.create({
    data: { content: trimmedContent, userId, blogId: blog.id, parentId },
    include: { user: { select: { id: true, name: true } } },
  });
};

const toggleLike = async (slug: string, userId: string) => {
  const blog = await prisma.blog.findUniqueOrThrow({ where: { slug } });
  const existingLike = await prisma.like.findUnique({
    where: { userId_blogId: { userId, blogId: blog.id } },
  });

  if (existingLike) {
    await prisma.like.delete({ where: { id: existingLike.id } });
  } else {
    await prisma.like.create({ data: { userId, blogId: blog.id } });
  }

  return {
    liked: !existingLike,
    likes: await prisma.like.count({ where: { blogId: blog.id } }),
  };
};

const getLikeStatus = async (slug: string, userId: string) => {
  const blog = await prisma.blog.findUniqueOrThrow({ where: { slug } });
  const like = await prisma.like.findUnique({
    where: { userId_blogId: { userId, blogId: blog.id } },
  });

  return { liked: Boolean(like) };
};

const updateBlog = async (
  slug: string,
  payload: Partial<BlogPayload>,
  user: AuthenticatedUser,
) => {
  const blog = await prisma.blog.findUniqueOrThrow({ where: { slug } });
  const author = await getAuthor(user);

  if (blog.authorId !== author.id && user.role !== "ADMIN") {
    throw new ApiError(StatusCodes.FORBIDDEN, "You cannot update this blog");
  }

  if (payload.status !== undefined && user.role !== "ADMIN") {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "Only admins can change blog publication status",
    );
  }

  const titleChanged =
    payload.title !== undefined && payload.title !== blog.title;
  const statusChangedToPublished =
    payload.status === BlogStatus.PUBLISHED &&
    blog.status !== BlogStatus.PUBLISHED;

  return prisma.blog.update({
    where: { id: blog.id },
    data: {
      ...(payload.title !== undefined ? { title: payload.title } : {}),
      ...(payload.excerpt !== undefined ? { excerpt: payload.excerpt } : {}),
      ...(payload.content !== undefined ? { content: payload.content } : {}),
      ...(payload.coverImage !== undefined
        ? { coverImage: payload.coverImage }
        : {}),
      ...(payload.status !== undefined ? { status: payload.status } : {}),
      ...(titleChanged
        ? { slug: await getUniqueSlug(payload.title!, blog.id) }
        : {}),
      ...(statusChangedToPublished ? { publishedAt: new Date() } : {}),
    },
    include: { author: { select: { id: true, name: true, email: true } } },
  });
};

const deleteBlog = async (slug: string, user: AuthenticatedUser) => {
  const blog = await prisma.blog.findUniqueOrThrow({ where: { slug } });
  const author = await getAuthor(user);

  if (blog.authorId !== author.id && user.role !== "ADMIN") {
    throw new ApiError(StatusCodes.FORBIDDEN, "You cannot delete this blog");
  }

  await prisma.blog.delete({ where: { id: blog.id } });
};

export const blogServices = {
  createBlog,
  getBlogs,
  getMyBlogs,
  getBlogBySlug,
  toggleLike,
  getLikeStatus,
  createComment,
  updateBlog,
  deleteBlog,
};
