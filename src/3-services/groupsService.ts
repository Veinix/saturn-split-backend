import { SupabaseClient } from "@supabase/supabase-js";
import supabase from "../plugins/db";

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
        const { data, error } = await supabase
            .from('groups')
            .select(`
        id,
        creator_id,
        name,
        description,
        group_icon,
        members:group_members(user_id),
        transactions:transactions(
          id,
          lender,
          borrower,
          amount,
          transaction_type,
          transaction_date
        )
      `)
            .eq('members.user_id', userId);

        if (error) {
            throw new Error(`Could not fetch groups: ${error.message}`);
        }
        return data;
    }
}

const groupService = new GroupsService();
export default groupService;