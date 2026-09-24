import { prisma } from "../../lib/prisma";

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

  return userInfo;
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
      createdAt: true,
      updatedAt: true
    },
  });
  return result;
};

const getAuthors = async () =>
  prisma.user.findMany({
    where: { blogs: { some: { status: "PUBLISHED" } } },
    select: {
      id: true,
      name: true,
      role: true,
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
  toggleFollow,
  getFollowStatus,
  deleteUser,
};
