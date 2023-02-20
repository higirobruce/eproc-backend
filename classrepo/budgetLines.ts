import { Types } from "mongoose";
import { IBudgetLines } from "../interfaces/iBudgetLines";

export class BudgetLine implements IBudgetLines {
  title: String;
  subLines: [];

  constructor(title: String, subLines: []) {
    this.title = title;
    this.subLines = subLines;
  }
}
