import { Document, Types } from "mongoose";

export interface IBudgetLines {
  title:String,
  subLines: [],
  visible: boolean;
  description: String
}

export interface IBudgetLinesDocument extends IBudgetLines, Document {
  
}
