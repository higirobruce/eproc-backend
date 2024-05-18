import { model, Schema, Types } from "mongoose";
import { IBudgetLines, IBudgetLinesDocument } from "../interfaces/iBudgetLines";

export const BudgetLinesSchema = new Schema<IBudgetLinesDocument>(
  {
    description: {
      type: String,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    department: {
      type: Types.ObjectId,
    },
  },
  { timestamps: true }
);

export const BudgetLineModel = model<IBudgetLines>(
  "BudgetLine",
  BudgetLinesSchema
);
