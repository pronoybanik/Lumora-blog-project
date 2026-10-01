import { prisma } from "../../lib/prisma";
import ApiError from "../../Errors/ApiError";
import { StatusCodes } from "http-status-codes";

type ProfileUpdatePayload = {
  bio?: string;
  avatar?: string;
  coverImage?: string;
  username?: string;
  location?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  profession?: string;
  expertise?: string;
};

const getMyProfile = async (user: { id: string }) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      authorStatus: true,
      authorAppliedAt: true,
      authorReviewedAt: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
      _count: { select: { followers: true, following: true } },
      followers: {
        select: { follower: { select: { id: true, name: true, profile: true } } },
        orderBy: { createdAt: "desc" },
      },
      following: {
        select: { following: { select: { id: true, name: true, profile: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: user.id,
      status: "ACTIVE",
      expiresAt: { gt: new Date() },
    },
    orderBy: { expiresAt: "desc" },
    select: {
      id: true,
      plan: true,
      status: true,
      startsAt: true,
      expiresAt: true,
    },
  });

  return { ...userInfo, subscription };
};

const updateMyProfile = async (
  userId: string,
  payload: ProfileUpdatePayload,
) => {
  const profileData = Object.fromEntries(
    Object.entries(payload).filter(([key]) => key !== "userId" && key !== "id"),
  ) as ProfileUpdatePayload;

  return prisma.profile.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      ...profileData,
    },
    update: profileData,
  });
};

const getALlUser = async () => {
  const result = prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      authorStatus: true,
      authorAppliedAt: true,
      authorReviewedAt: true,
      createdAt: true,
      updatedAt: true
    },
  });
  return result;
};

const applyForAuthor = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { role: true, authorStatus: true },
  });

  if (user.role === "ADMIN" || user.authorStatus === "APPROVED") {
    throw new ApiError(StatusCodes.BAD_REQUEST, "You are already a verified author");
  }

  if (user.authorStatus === "PENDING") {
    throw new ApiError(StatusCodes.CONFLICT, "Your author application is already pending");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { authorStatus: "PENDING", authorAppliedAt: new Date(), authorReviewedAt: null },
    select: { id: true, role: true, authorStatus: true, authorAppliedAt: true },
  });
};

const getAuthorApplications = async () =>
  prisma.user.findMany({
    where: { authorStatus: { in: ["PENDING", "APPROVED"] } },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      authorStatus: true,
      authorAppliedAt: true,
      authorReviewedAt: true,
      profile: true,
      _count: { select: { blogs: true } },
    },
    orderBy: { authorAppliedAt: "desc" },
  });

const reviewAuthorApplication = async (
  userId: string,
  decision: "APPROVED" | "REJECTED",
) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { role: true, authorStatus: true } });

  if (user.role === "ADMIN") {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Admins cannot be author applicants");
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      role: decision === "APPROVED" ? "AUTHOR" : "USER",
      authorStatus: decision,
      authorReviewedAt: new Date(),
    },
    select: { id: true, name: true, email: true, role: true, authorStatus: true, authorReviewedAt: true },
  });
};

const getAuthors = async () =>
  prisma.user.findMany({
    where: {
      role: "AUTHOR",
      authorStatus: "APPROVED",
    },
    select: {
      id: true,
      name: true,
      role: true,
      profile: true,
      _count: { select: { blogs: true, followers: true } },
    },
    orderBy: { createdAt: "desc" },
  });

const getVerifiedAuthors = async () =>
  prisma.user.findMany({
    where: {
      role: "AUTHOR",
      authorStatus: "APPROVED",
    },
    select: {
      id: true,
      name: true,
      role: true,
      authorStatus: true,
      profile: true,
      _count: { select: { blogs: true, followers: true } },
    },
    orderBy: { createdAt: "desc" },
  });

const toggleFollow = async (followingId: string, followerId: string) => {
  if (followingId === followerId) {
    throw new Error("You cannot follow yourself");
  }

  const existingFollow = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });

  if (existingFollow) {
    await prisma.follow.delete({ where: { id: existingFollow.id } });
  } else {
    await prisma.follow.create({ data: { followerId, followingId } });
  }

  return {
    following: !existingFollow,
    followers: await prisma.follow.count({ where: { followingId } }),
  };
};

const getFollowStatus = async (followingId: string, followerId: string) => {
  const follow = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });
  return { following: Boolean(follow) };
};

const deleteUser = async (userId: string) => {
  return prisma.user.delete({
    where: {
      id: userId,
    },
  });
};

export const userServices = {
  getMyProfile,
  updateMyProfile,
  getALlUser,
  getAuthors,
  getVerifiedAuthors,
  toggleFollow,
  getFollowStatus,
  deleteUser,
  applyForAuthor,
  getAuthorApplications,
  reviewAuthorApplication,
};
