import { IUserDocument } from "../interfaces/iUsers";
import mongoose, { Schema, model, connect, Document, Types } from "mongoose";
import { IRequest, IRequestDocument } from "../interfaces/iRequestes";

export const RequestSchema = new Schema<IRequestDocument>({
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
  },
  attachementUrls: Array,
  dueDate: Date,
  items: Array,
  status: {
    type: String,
    default: "pending",
  },
  number: {
    type: Number,
  },
  description: {
    type: String,
  },
  serviceCategory: {
    type: String,
  },
  reasonForRejection: {
    type: String,
  },
  declinedBy: {
    type: String,
  },
  budgeted: {
    type: Boolean,
  },
  budgetLine: {
    type: Types.ObjectId,
    ref: "BudgetLine",
  },
  hod_approvalDate: {
    type: Date
  },
  hof_approvalDate: {
    type: Date,
  },
  pm_approvalDate: {
    type: Date
  },
  rejectionDate: {
    type: Date
  },
  title: {
    type: String,
  },
  level1Approver: {
    type: Types.ObjectId,
    ref: "User",
  },
  sourcingMethod: {
    type: String,
  },
}, {timestamps: true});

export const RequestModel = model<IRequestDocument>("Request", RequestSchema);
