import { Document, Types } from "mongoose";

export interface IBudgetLines {
  title:String,
  subLines: []
}

export interface IBudgetLinesDocument extends IBudgetLines, Document {
  
}
