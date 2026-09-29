import { prisma } from "../../lib/prisma";
import ApiError from "../../Errors/ApiError";
import { StatusCodes } from "http-status-codes";

type CategoryPayload = {
  name: string;
  description?: string;
};

const makeSlug = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "category";

const getUniqueSlug = async (name: string, excludedId?: string) => {
  const baseSlug = makeSlug(name);
  let slug = baseSlug;
  let suffix = 1;

  while (
    await prisma.category.findFirst({
      where: { slug, ...(excludedId ? { NOT: { id: excludedId } } : {}) },
    })
  ) {
    slug = `${baseSlug}-${suffix++}`;
  }

  return slug;
};

const validateName = (name?: string) => {
  const trimmedName = name?.trim();

  if (!trimmedName) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category name is required");
  }

  if (trimmedName.length < 2 || trimmedName.length > 50) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Category name must be between 2 and 50 characters",
    );
  }

  return trimmedName;
};

const getCategories = () =>
  prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { blogs: true } } },
  });

const createCategory = async (payload: CategoryPayload) => {
  const name = validateName(payload.name);
  const slug = await getUniqueSlug(name);

  return prisma.category.create({
    data: {
      name,
      slug,
      description: payload.description?.trim() || undefined,
    },
    include: { _count: { select: { blogs: true } } },
  });
};

const updateCategory = async (
  id: string,
  payload: Partial<CategoryPayload>,
) => {
  const existing = await prisma.category.findUniqueOrThrow({ where: { id } });
  const name = payload.name === undefined ? existing.name : validateName(payload.name);

  return prisma.category.update({
    where: { id },
    data: {
      ...(payload.name !== undefined
        ? { name, slug: await getUniqueSlug(name, id) }
        : {}),
      ...(payload.description !== undefined
        ? { description: payload.description.trim() || null }
        : {}),
    },
    include: { _count: { select: { blogs: true } } },
  });
};

const deleteCategory = async (id: string) => {
  await prisma.category.delete({ where: { id } });
};

export const categoryServices = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
