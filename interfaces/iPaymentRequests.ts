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
}
