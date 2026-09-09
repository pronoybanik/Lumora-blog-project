import config from "../../config";
import { prisma } from "../../lib/prisma";
import * as bcrypt from 'bcrypt'
import { jwtHelpers } from "../../utils/jwtHelper";
type RegisterPayload = {
    name: string;
    email: string;
    password: string;
};

const createUser = async (payload: RegisterPayload) => {
    const hashedPassword = await bcrypt.hash(payload.password, 12);

    const userData = await prisma.user.create({
        data: {
            name: payload.name,
            email: payload.email,
            password: hashedPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return userData;
};

const loginUser = async (payload: {
    email: string,
    password: string
}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
        }
    })

    const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password incorrect!")
    }

    const accessToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    },
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    )

    const refreshToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    },
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string
    )


    return {
        accessToken,
        refreshToken,
    };
};

export const authServices = {
    createUser,
    loginUser
}