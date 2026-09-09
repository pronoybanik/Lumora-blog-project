import { BlogStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import ApiError from "../../Errors/ApiError";
import { StatusCodes } from "http-status-codes";

type AuthenticatedUser = {
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
    where: { email: user.email },
    select: { id: true },
  });

const createBlog = async (payload: BlogPayload, user: AuthenticatedUser) => {
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
    include: { author: { select: { id: true, name: true } } },
  });

const getBlogBySlug = async (slug: string) =>
  prisma.blog.findUniqueOrThrow({
    where: { slug },
    include: {
      author: { select: { id: true, name: true } },
      comments: true,
      likes: true,
    },
  });

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

  const titleChanged =
    payload.title !== undefined && payload.title !== blog.title;
  const statusChangedToPublished =
    payload.status === BlogStatus.PUBLISHED &&
    blog.status !== BlogStatus.PUBLISHED;

  return prisma.blog.update({
    where: { id: blog.id },
    data: {
      ...payload,
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
  getBlogBySlug,
  updateBlog,
  deleteBlog,
};
