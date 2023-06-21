import moment from "moment";
import mongoose, { Schema, model, connect, Document, Types } from "mongoose";
import { iPaymentRequestDocument, PaymentRequestCategory } from "../interfaces/iPaymentRequests";

export const PaymentRequestSchema = new Schema<iPaymentRequestDocument>(
  {
    number: Number,
    description: String,
    title: String,
    amount: Number,
    purchaseOrder: {
      type: Types.ObjectId,
      ref: "PurchaseOrder",
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    approver: {
      type: Types.ObjectId,
      ref: "User",
    },
    docIds: [{ type: String }],
    paymentProofDocs:[{type: String}],
    status: {
      type: String,
      default: "pending-review",
    },
    reasonForRejection: String,
    declinedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    reviewedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    rejectionDate: {
      type: Date,
      default: moment(),
    },
    reviewedAt: {
      type: Date,
    },
    hod_approvalDate: {
      type: Date,
    },
    hof_approvalDate: {
      type: Date,
    },
    budgeted: {
      type: Boolean,
    },
    budgetLine: {
      type: Types.ObjectId,
      ref: "BudgetLine",
    },
    category: {
      type: String,
      default: PaymentRequestCategory.internal
    },
    currency: {
      type: String,
      default: "RWF"
    }
  },
  { timestamps: true }
);


export const PaymentRequestModel = model<iPaymentRequestDocument>(
  "PaymentRequest",
  PaymentRequestSchema
);
