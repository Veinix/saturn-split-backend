import { UserAuth, PublicUser } from "./db.types";

export enum UserRoles {
    Developer = "developer",
    Manager = "manager",
    User = "user",
}

export type RegisterBody = UserAuth & {
    favorite_color: string | null,
    username: string,
}

export type LoginBody = {
    username: string,
    password: string,
}

export interface JWTPayload {
    userData: {
        partialName: string,
        role: string,
        userId: string,
        username: string,
        favoriteColor: string,
    },
    iat: number,
    exp: number,
}