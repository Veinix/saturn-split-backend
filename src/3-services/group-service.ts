import { Database } from "@app-types/database.types.js";
import { WIPGroupOverview, GroupMemberRoles, WIPReturnSingleGroup } from "@app-types/db.types.js";
import { SupabaseClient } from "@supabase/supabase-js";

class GroupsService {
    async getAllGroups(
        supabase: SupabaseClient<Database>
    ) {
        const { data, error } = await supabase
            .from("groups")
            .select("*");
        if (error) throw error;
        return data;
    }

    async getUserGroups(
        userId: string,
        supabase: SupabaseClient<Database>
    ) {
        // 1) Which groups is the user in?
        const { data: membership, error: memErr } = await supabase
            .from("group_members")
            .select("group_id")
            .eq("user_id", userId);
        if (memErr) throw memErr;
        const groupIds = membership!.map((m) => m.group_id);

        if (groupIds.length === 0) {
            return [] as WIPGroupOverview[];
        }

        // 2) Load core group data
        const { data: groupsRaw, error: grpErr } = await supabase
            .from("groups")
            .select("id, name, description, icon, creator_id")
            .in("id", groupIds);
        if (grpErr) throw grpErr;

        // 3) Load *all* members for those groups (with usernames)
        const { data: membersRaw, error: membersErr } = await supabase
            .from("group_members")
            .select(`
                group_id,
                user_id,
                group_role,
                public_users!group_members_user_id_fkey ( username )
                `)
            .in("group_id", groupIds);
        if (membersErr) throw membersErr;

        // 4) Load the creators’ usernames
        const creatorIds = [...new Set(groupsRaw!.map((g) => g.creator_id).filter((id): id is string => !!id))];
        const { data: creatorsRaw, error: creatorsErr } = await supabase
            .from("public_users")
            .select("id, username")
            .in("id", creatorIds);
        if (creatorsErr) throw creatorsErr;

        // --- Assemble ---
        // Map group_id → members[]
        const membersByGroup: Record<string, WIPGroupOverview["members"]> = {}
        for (const m of membersRaw!) {
            const groupArr = (membersByGroup[m.group_id] ??= []);
            if (!m.public_users) {
                throw new Error(`Missing user record for ${m.user_id}`);
            }
            const username = m.public_users.username;
            groupArr.push({
                userId: m.user_id!,
                userRole: (m.group_role ?? GroupMemberRoles.GroupMember) as GroupMemberRoles,
                username: username,
            });
        }

        // Map creator_id → {userId,username}
        const creatorMap: Record<string, { userId: string; username: string }> = {};
        for (const c of creatorsRaw!) {
            creatorMap[c.id] = { userId: c.id, username: c.username };
        }

        // Final shape
        const result: WIPGroupOverview[] = groupsRaw!.map((g) => ({
            id: g.id,
            created_by: creatorMap[g.creator_id!]!,
            name: g.name,
            description: g.description,
            icon: g.icon,
            members: membersByGroup[g.id] ?? [],
        }));
        console.log(result)
        return result;
    }

    async getSingleGroup(
        groupId: string,
        supabase: SupabaseClient<Database>
    ) {

        // 1) core group info
        const { data: grp, error: groupErr } = await supabase
            .from("groups")
            .select("id, icon, description, creator_id")
            .eq("id", groupId)
            .single();
        if (groupErr) throw groupErr;
        if (!grp) throw new Error("Group not found");

        // 2) members + usernames
        const { data: membersRaw, error: memErr } = await supabase
            .from("group_members")
            .select(`
            user_id,
            group_role,
            public_users!group_members_user_id_fkey ( username )
            `)
            .eq("group_id", groupId);
        if (memErr) throw memErr;

        // 3) expenses for this group
        const { data: expensesRaw, error: expErr } = await supabase
            .from("expenses")
            .select("id, lender_id, amount, transaction_date, fully_paid")
            .eq("group_id", groupId);
        if (expErr) throw expErr;

        // 4) all split‐transactions across those expenses
        const expenseIds = expensesRaw!.map((e) => e.id);
        const { data: splitsRaw, error: splitErr } = await supabase
            .from("transaction_split")
            .select("transactionId, userId, amount, paid_at, paid")
            .in("expense_id", expenseIds);
        if (splitErr) throw splitErr;

        // assemble
        const groupMembers = membersRaw!.map((m) => ({
            userId: m.user_id!,
            userRole: m.group_role!,
            username: m.public_users!.username!,
        }));

        const groupExpenses = expensesRaw!.map((e) => ({
            expenseId: e.id,
            lenderId: e.lender_id,
            amount: e.amount,
            transactionDate: e.transaction_date!,
            fullyPaid: e.fully_paid,
        }));

        const groupTransactions = splitsRaw!.map((ts) => ({
            transactionId: ts.transactionId,
            lendeeId: ts.userId!,
            amount: ts.amount,
            paid: ts.paid,
            paidAt: ts.paid_at!,
        }));

        return {
            groupData: {
                groupId: grp.id,
                groupIcon: grp.icon,
                groupDescription: grp.description,
                groupCreatorId: grp.creator_id!,
            },
            groupMembers,
            groupExpenses,
            groupTransactions,
        } as WIPReturnSingleGroup;
    }

    // async addExpense(
    //     payload: GroupExpense,
    //     supabase: SupabaseClient<Database>
    // ): Promise<GroupExpense> {
    //     // Insert into your “expenses” table
    //     const { data, error } = await supabase
    //         .from('expenses')
    //         .insert(`
    //             group_id: groupId,
    //             description: payload.description,
    //             amount: payload.amount,
    //             paid_by: payload.paidBy,
    //             splits: payload.splits,   // if you have a JSONB column
    //         `)
    //         .single();

    //     if (error) throw error;
    //     return data;
    // }
}

const groupService = new GroupsService();
export default groupService;