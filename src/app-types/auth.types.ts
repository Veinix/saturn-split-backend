
export enum UserRoles {
    Developer = "developer",
    Manager = "manager",
    User = "user",
}

export type RegisterBody = {
    password: string,
    full_name: string,
    favorite_color: string | null,
    username: string,
    role: UserRoles | null,
    last_login_at?: string,
}

export type LoginBody = {
    username: string,
    password: string,
}

export interface UserJWTPayload {
    userData: {
        partialName: string,
        role: string,
        userId: string,
        username: string,
        favoriteColor: string,
    },
    iat?: number,
    exp?: number,
}
