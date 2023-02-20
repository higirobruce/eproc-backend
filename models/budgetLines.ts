import { model, Schema, Types } from "mongoose";
import { IBudgetLines } from "../interfaces/iBudgetLines";


export const BudgetLinesSchema = new Schema<IBudgetLines>({
   
    title: {
        type: String
    },
    subLines: []
})

export const BudgetLineModel = model<IBudgetLines>('BudgetLine', BudgetLinesSchema);