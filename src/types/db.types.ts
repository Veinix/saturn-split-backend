export type Group = {
    creator_id: string,
    description: string | null,
    icon: string | null,
    id: string,
    name: string,
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

export enum UserRoles {
    Developer = "developer",
    Manager = "manager",
    User = "user",
}
export type User = {
    id: string,
    username: string,
    password: string,
    phone_number?: string,
    full_name: string,
    favorite_color?: string,
    role: UserRoles
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

// Extra Types
export type BaseUser = Pick<User, "full_name" | "favorite_color" | "id">

export interface GroupWithDetails extends Group {
    members: BaseUser[];
    transactions: Transaction[];
};