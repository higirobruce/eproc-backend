import moment from "moment";
import mongoose, { Schema, model, connect, Document, Types } from "mongoose";
import { iPaymentRequestDocument } from "../interfaces/iPaymentRequests";

export const PaymentRequestSchema = new Schema<iPaymentRequestDocument>(
  {
    number: Number,
    description: String,
    title: String,
    amount: Number,
    purchaseOrder: {
      type: Types.ObjectId,
      ref: "PurchaseOrder",
      required: true,
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
    status: {
      type: String,
      default: "pending-review",
    },
    reasonForRejection: String,
    declinedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    rejectionDate: {
      type: Date,
      default: moment(),
    },
  },
  { timestamps: true }
);

export const PaymentRequestModel = model<iPaymentRequestDocument>(
  "PaymentRequest",
  PaymentRequestSchema
);
