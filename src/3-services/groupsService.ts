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
        const { data: singleGroup, error } = await supabase
            .from("transactions")
            .select("*")
        // .eq("transactions.group_id", groupId)

        if (error) {
            throw new Error(`[SingleGroup Method] Error getting group data: ${error.message}`)
        }

        return singleGroup
    }
}

const groupService = new GroupsService();
export default groupService;