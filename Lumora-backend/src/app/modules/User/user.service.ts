import { prisma } from "../../lib/prisma";

const getMyProfile = async (user: { email: string }) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
    // select: {
    //   id: true,
    //   email: true,
    //   role: true,
    // },
  });

  return userInfo;
};

export const userServices = {
  getMyProfile,
};
