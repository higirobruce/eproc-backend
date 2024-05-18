import { Document, Types } from "mongoose";

export interface IBudgetLines {
  visible: boolean;
  description: String;
}

export interface IBudgetLinesDocument extends IBudgetLines, Document {
  department: {
    type: Types.ObjectId;
  };
}
