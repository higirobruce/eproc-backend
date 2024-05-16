import { Types } from "mongoose";
import { IBudgetLines } from "../interfaces/iBudgetLines";

export class BudgetLine implements IBudgetLines {
  title: String;
  subLines: [];
  visible: boolean;
  description: String;

  constructor(
    title: String,
    subLines: [],
    visible: boolean,
    description: String
  ) {
    this.title = title;
    this.subLines = subLines;
    this.visible = visible;
    this.description = description;
  }
}
