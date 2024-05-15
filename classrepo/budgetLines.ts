import { Types } from "mongoose";
import { IBudgetLines } from "../interfaces/iBudgetLines";

export class BudgetLine implements IBudgetLines {
  title: String;
  subLines: [];
  visible: boolean;

  constructor(title: String, subLines: [], visible: boolean) {
    this.title = title;
    this.subLines = subLines;
    this.visible = visible;
  }
}
