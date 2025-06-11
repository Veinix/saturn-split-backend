import { UserRoles } from "./auth.types"

export type Group = {
    id: string,
    creator_id: string,
    name: string,
    description: string | null,
    icon: string | null,
}

export enum GroupMemberRoles {
    GroupOwner = "owner",
    GroupMember = "member",
}

export type GroupMember = {
    group_id: string,
    user_id: string,
    group_role: GroupMemberRoles,
}

export type PublicUser = {
    id: string,
    username: string,
    role: UserRoles,

    favorite_color: string | null,
}

export type UserAuth = {
    password: string,
    phone_number: string | null,
    full_name: string,
    last_login_at?: string,
}

export type Transaction = {
    id: string,
    group_id: string,
    lender_id: string,
    borrower_id: string,
    amount: number,
    transaction_type: boolean,
    transaction_date?: Date
}
