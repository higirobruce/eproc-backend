import { Schema, model, Types } from "mongoose";
import { ITenderDocument } from "../interfaces/iTenders";

export const TenderSchema = new Schema<ITenderDocument>(
{
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
  },
  attachementUrls: Array,
  dueDate: Date,
  submissionDeadLine: Date,
  purchaseRequest: {
    type: Types.ObjectId,
    ref: "Request",
  },
  torsUrl: String,
  items: Array,
  status: {
    type: String,
    default: "pending",
  },
  number: {
    type: Number,
  },
  invitationSent: {
    type: Boolean,
    default: false,
  },
  invitees: [],
  docId: String,
  evaluationReportId: String
},
{timestamps: true}
);

export const TenderModel = model<ITenderDocument>("Tender", TenderSchema);
