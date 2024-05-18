import { Types } from "mongoose";
import { IBudgetLines } from "../interfaces/iBudgetLines";

export class BudgetLine implements IBudgetLines {
  visible: boolean;
  description: String;
  department: Types.ObjectId
  constructor(
    visible: boolean,
    description: String,
    department: Types.ObjectId
  ) {
    this.visible = visible;
    this.description = description;
    this.department = department
  }
}
