import { Types } from "mongoose";
import { IRequest } from "../interfaces/iRequestes";
import { ContractStatus } from "../types/types";
import { PoLineItem } from "./poLineItems";

export class Request implements IRequest {
  createdBy: Types.ObjectId;
  items: PoLineItem[];
  dueDate: Date;
  status: ContractStatus;
  attachementUrls: string[];
  number: number;
  description: string;
  serviceCategory: string;
  reasonForRejection: string;
  declinedBy: string;
  budgeted: boolean;
  budgetLine: Types.ObjectId;
  title: string;
  hod_approvalDate: Date;
  hof_approvalDate: Date;
  pm_approvalDate: Date;
  rejectionDate: Date;
  level1Approver: Types.ObjectId;
  sourcingMethod: string;

  constructor(
    createdBy: string,
    items: PoLineItem[],
    dueDate: Date,
    status: ContractStatus,
    attachementUrls: string[],
    number: number,
    description: string,
    serviceCategory: string,
    reasonForRejection: string,
    declinedBy: string,
    budgeted: boolean,
    budgetLine: string,
    title: string,
    hod_approvalDate: Date,
    hof_approvalDate: Date,
    pm_approvalDate: Date,
    rejectionDate: Date,
    level1Approver: string,
    sourcingMethod: string
  ) {
    this.createdBy = createdBy
      ? new Types.ObjectId(createdBy)
      : new Types.ObjectId();
    this.items = items;
    this.dueDate = dueDate;
    this.status = status;
    this.attachementUrls = attachementUrls;
    this.number = number;
    this.description = description;
    this.serviceCategory = serviceCategory;
    this.reasonForRejection = reasonForRejection;
    this.declinedBy = declinedBy;
    this.budgeted = budgeted;
    this.budgetLine = budgetLine ? new Types.ObjectId(budgetLine): new Types.ObjectId();
    this.title = title;
    this.hod_approvalDate = hod_approvalDate;
    this.hof_approvalDate = hof_approvalDate;
    this.pm_approvalDate = pm_approvalDate;
    this.rejectionDate = rejectionDate;
    this.level1Approver = level1Approver
      ? new Types.ObjectId(level1Approver)
      : new Types.ObjectId();
    this.sourcingMethod = sourcingMethod
  }
}
