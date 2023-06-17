import moment from "moment";
import mongoose, { Types } from "mongoose";

export interface iPaymentRequest {
  number: number;
  description: string;
  title: string;
  amount: number;
  docIds: [];
  status: string;
  rejectionDate: Date;
  reasonForRejection: String;
  hod_approvalDate: Date;
  hof_approvalDate: Date;
  reviewedAt: Date;
  paymentProofDocs:[]
}

export interface iPaymentRequestDocument
  extends iPaymentRequest,
    mongoose.Document {
  purchaseOrder: {
    type: Types.ObjectId;
    ref: "PurchaseOrder";
  };
  createdBy: {
    type: Types.ObjectId;
    ref: "User";
  };
  approver: {
    type: Types.ObjectId;
    ref: "User";
  };

  declinedBy: {
    type: Types.ObjectId;
    ref: "User";
  };
  reviewedBy: {
    type: Types.ObjectId,
    ref: "User",
  },
  budgeted: {
    type: Boolean,
  },
  budgetLine: {
    type: Types.ObjectId,
    ref: "BudgetLine",
  },
}
