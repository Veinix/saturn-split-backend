import { SupabaseClient } from "@supabase/supabase-js";

class GroupsService {
    async getAllGroups(
        supabase: SupabaseClient
    ) {
        const { data, error } = await supabase
            .from("groups")
            .select("*");
        if (error) throw error;
        return data;
    }

    async getUserGroups(
        userId: string,
        supabase: SupabaseClient
    ) {
        const { data: groups, error } = await supabase
            .from('groups')
            .select('*, group_members!inner(user_id)')
            .eq('group_members.user_id', userId);

        if (error) {
            throw new Error(`Could not fetch groups: ${error.message}`);
        }
        return groups;
    }

    async getSingleGroup(
        groupId: string,
        supabase: SupabaseClient
    ) {
        // const { data: singleGroup, error } = await supabase
        //     .from("transactions")
        //     .select("*")
        // .eq("transactions.group_id", groupId)

        // if (error) {
        //     throw new Error(`[SingleGroup Method] Error getting group data: ${error.message}`)
        // }
        const singleGroupTransactions = [
            {
                transactionId: 'tx1',
                groupId: 'group1',
                lenderId: 'David',
                borrowerId: 'Eran',
                amount: -100,
                transactionType: false,
                transactionDate: '2025-06-01',
            },
            {
                transactionId: 'tx2',
                groupId: 'group1',
                lenderId: 'Eran',
                borrowerId: 'David',
                amount: 50,
                transactionType: true,
                transactionDate: '2025-06-02',
            },
            {
                transactionId: 'tx3',
                groupId: 'group1',
                lenderId: 'Omer',
                borrowerId: 'David',
                amount: -30,
                transactionType: false,
                transactionDate: '2025-06-03',
            },
            {
                transactionId: 'tx4',
                groupId: 'group1',
                lenderId: 'David',
                borrowerId: 'Omer',
                amount: 30,
                transactionType: true,
                transactionDate: '2025-06-04',
            },
            {
                transactionId: 'tx5',
                groupId: 'group1',
                lenderId: 'Eran',
                borrowerId: 'Omer',
                amount: -80,
                transactionType: false,
                transactionDate: '2025-06-05',
            },
            {
                transactionId: 'tx6',
                groupId: 'group1',
                lenderId: 'Omer',
                borrowerId: 'Eran',
                amount: 80,
                transactionType: true,
                transactionDate: '2025-06-06',
            },
            {
                transactionId: 'tx7',
                groupId: 'group1',
                lenderId: 'David',
                borrowerId: 'Eran',
                amount: -25,
                transactionType: false,
                transactionDate: '2025-06-07',
            },
            {
                transactionId: 'tx8',
                groupId: 'group1',
                lenderId: 'Eran',
                borrowerId: 'David',
                amount: 25,
                transactionType: true,
                transactionDate: '2025-06-08',
            },
            {
                transactionId: 'tx9',
                groupId: 'group1',
                lenderId: 'Omer',
                borrowerId: 'David',
                amount: -60,
                transactionType: false,
                transactionDate: '2025-06-09',
            },
            {
                transactionId: 'tx10',
                groupId: 'group1',
                lenderId: 'David',
                borrowerId: 'Omer',
                amount: 60,
                transactionType: true,
                transactionDate: '2025-06-10',
            },
            {
                transactionId: 'tx11',
                groupId: 'group1',
                lenderId: 'Eran',
                borrowerId: 'Omer',
                amount: -45,
                transactionType: false,
                transactionDate: '2025-06-11',
            },
            {
                transactionId: 'tx12',
                groupId: 'group1',
                lenderId: 'Omer',
                borrowerId: 'Eran',
                amount: 45,
                transactionType: true,
                transactionDate: '2025-06-12',
            },
            {
                transactionId: 'tx13',
                groupId: 'group1',
                lenderId: 'David',
                borrowerId: 'Eran',
                amount: -15,
                transactionType: false,
                transactionDate: '2025-06-13',
            },
            {
                transactionId: 'tx14',
                groupId: 'group1',
                lenderId: 'Eran',
                borrowerId: 'David',
                amount: 15,
                transactionType: true,
                transactionDate: '2025-06-14',
            },
            {
                transactionId: 'tx15',
                groupId: 'group1',
                lenderId: 'Omer',
                borrowerId: 'David',
                amount: -90,
                transactionType: false,
                transactionDate: '2025-06-15',
            },
        ];
        return singleGroupTransactions
    }
}

const groupService = new GroupsService();
export default groupService;