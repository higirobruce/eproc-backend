import { BudgetLine } from "../classrepo/budgetLines";
import { BudgetLineModel } from "../models/budgetLines";
import { DepartmentModel } from "../models/departments";


export async function getAllBudgetLines() {
    let pipeline = [
        {
          '$lookup': {
            'from': 'budgetlines', 
            'localField': '_id', 
            'foreignField': 'department', 
            'as': 'budgetlines'
          }
        }
      ]
    try {
        // let dpts = await BudgetLineModel.find();
        let _dpts = await DepartmentModel.aggregate(pipeline)

        return _dpts;
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
