import { BudgetLine } from "../classrepo/budgetLines";
import { BudgetLineModel } from "../models/budgetLines";


export async function getAllBudgetLines() {
    try {
        let dpts = await BudgetLineModel.find();
        return dpts;
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}

export async function saveBudgetLine(budgetLine: BudgetLine) {
    try {
        let createdBudgetL = await BudgetLineModel.create(budgetLine)
        return createdBudgetL._id
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}
