import { Document, Types } from "mongoose";
import { PoLineItem } from "../classrepo/poLineItems";
import { ContractStatus } from "../types/types";

export interface IRequest {
  items: PoLineItem[];
  dueDate: Date;
  status: ContractStatus;
  attachementUrls: String[];
  number: number;
  description: String;
  serviceCategory: String;
  reasonForRejection: String;
  declinedBy: String;
  budgeted: boolean;

  hod_approvalDate: Date;
  hof_approvalDate: Date;
  pm_approvalDate: Date;
  rejectionDate: Date;
  title: String;
  sourcingMethod: String;
  supportingDocs: [];
  currency: String;
}

export interface IRequestDocument extends IRequest, Document {
  createdBy: {
    _id: any;
    type: Types.ObjectId;
    ref: "User";
  };
  level1Approver: {
    _id: string;
    userType: null;
    type: Types.ObjectId;
    ref: "User";
  };
  budgetLine: {
    type: Types.ObjectId;
    ref: "BudgetLine";
  };
}
