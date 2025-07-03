import { SupabaseClient } from "@supabase/supabase-js"

type TemporaryExpenseType = {
    expenseId: string,
    group_id: string,
    lender_id: string,
    amount: number,
    transaction_date: string //But actually Date
}

type TemporarySplitType = {
    transaction_id: string,
    user_id: string,
    amount: string,
    paid_at: string | null, // If it was paid, value. No value === not paid
    paid: boolean
}

class TransactionsService {
    //* Managing Expense Requests
    addNewExpense = async (
        supabase: SupabaseClient,
        groupId: string,
        expense: TemporaryExpenseType,
        expenseSplit: TemporarySplitType[] // Array of the split, what each person owes
    ) => {
        // Check that the expense is equal to the sum of the expenseSplits
        // If not, return an error "Sum of split is not equal to the original expense"

        // Make a request to add to the expenses table

        // Make a request to add to the transaction_split table

        // Return a success (maybe the updated rows?)
    }

    deleteExistingExpense = async (
        supabase: SupabaseClient,
        ownerId: string,
        groupId: string,
        expenseId: TemporaryExpenseType,
    ) => {
        // Check that the expense exists
        // If not, return error saying that the expense doesn't exist

        // Check that the lender of the expense is the one that sent the request
        // If not, return error saying "not allowed"

        // If expense exists, and the owner of the expense is the one asking for the deletion,
        // Delete the expense, and the transactions associated with it, and make sure that the group won't have that expense in it
    }

    editExistingExpense = async () => {

    }

    //* Managing Paying back
    payBackDebt = async () => {

    }

    //TODO (but not mvp) Make it possible to pay back partialy amounts of the debt. Not necesarilly the whole debt.

}

const transactionsService = new TransactionsService()