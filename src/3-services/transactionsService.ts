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

    editExistingExpense = async () => {

    }

    deleteExistingExpense = async () => {

    }

    //* Managing Paying back
    payBackDebt = async () => {

    }

    // Make it possible to pay back partialy amounts of the debt. Not necesarilly the whole debt.


}

const transactionsService = new TransactionsService()