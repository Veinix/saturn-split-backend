// import supabase from "../plugins/db";

// export async function getAllGroups() {
//     const { data, error } = await supabase
//         .from("groups")
//         .select("*");
//     if (error) throw error;
//     return data;
// }

// export async function getUserGroups(
//     userId: string
// ) {
//     const { data, error } = await supabase
//         .from('groups')
//         .select(`
//         id,
//         creator_id,
//         name,
//         description,
//         group_icon,
//         members:group_members(user_id),
//         transactions:transactions(
//           id,
//           lender,
//           borrower,
//           amount,
//           transaction_type,
//           transaction_date
//         )
//       `)
//         .eq('members.user_id', userId);

//     if (error) {
//         throw new Error(`Could not fetch groups: ${error.message}`);
//     }
//     return data;
// }