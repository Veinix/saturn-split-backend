import { UserRoles } from "./auth.types"
import { Database } from "./database.types"

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
    phone_number?: string | null,
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
// Aliases
type GroupsRow = Database["public"]["Tables"]["groups"]["Row"];
type MembersRow = Database["public"]["Tables"]["group_members"]["Row"];
type PrivDetailsRow = Database["public"]["Tables"]["private_user_details"]["Row"];
type PublicUserRow = Database["public"]["Tables"]["public_users"]["Row"]
type TxRow = Database["public"]["Tables"]["transaction_split"]["Row"]
type ExpenseRow = Database["public"]["Tables"]["expenses"]["Row"]

export type WIPGroupOverview = {
    id: string
    created_by: { username: string, userId: string }
    name: string
    description: string | null
    icon: string | null
    members: { username: string, userId: string, userRole: GroupMemberRoles }[]
}
export type WIPReturnSingleGroup = {
    groupData: {
        groupId: GroupsRow["id"],
        groupIcon: GroupsRow["icon"],
        groupDescription: GroupsRow["description"],
        groupCreatorId: NonNullable<GroupsRow["creator_id"]>,
    },
    groupMembers: {
        userId: MembersRow["user_id"],
        userRole: NonNullable<MembersRow["group_role"]>,
        username: PublicUserRow["username"],
    }[],
    groupExpenses: {
        expenseId: ExpenseRow["id"],
        lenderId: ExpenseRow["lender_id"],
        amount: ExpenseRow["amount"],
        transactionDate: NonNullable<ExpenseRow["transaction_date"]>,
        fullyPaid: ExpenseRow["fully_paid"],
    }[],
    groupTransactions: {
        transactionId: TxRow["transactionId"],
        lendeeId: TxRow["userId"],
        amount: TxRow["amount"],
        paid: TxRow["paid"],
        paidAt: NonNullable<TxRow["paid_at"]>,
    }[],
}