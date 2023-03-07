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
    type: String,
  },
  hod_approvalDate: {
    type: Date,
    default: Date.now(),
  },
  hof_approvalDate: {
    type: Date,
    default: Date.now(),
  },
  pm_approvalDate: {
    type: Date,
    default: Date.now(),
  },
  title: {
    type: String,
  },
  level1Approver: {
    type: Types.ObjectId,
    ref: "User",
  },
});

export const RequestModel = model<IRequestDocument>("Request", RequestSchema);
