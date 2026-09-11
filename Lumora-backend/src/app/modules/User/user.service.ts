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
    },
  });

  return userInfo;
};

const updateMyProfile = async (
  userId: string,
  payload: ProfileUpdatePayload,
) => {
  return prisma.profile.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      ...payload,
    },
    update: payload,
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
  deleteUser,
};
