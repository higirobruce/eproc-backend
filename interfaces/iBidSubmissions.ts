import { Document, Types } from "mongoose";

export interface IBidSubmission {
  proposalUrls: String[];
  deliveryDate: Date;
  price: number;
  currency: String;
  warranty: number;
  warrantyDuration: String;
  discount: number;
  status: String;
  comment: String;
  number: number;
  proposalDocId: String;
  otherDocId: String;
  bankName: String;
  bankAccountNumber: String;
  bankAccountName: String;
  deliveryTimeFrameDuration: String;
  deliveryTimeFrame: Number;
}

export interface IBidSubmissionDocument extends IBidSubmission, Document {
  createdBy: {
    type: Types.ObjectId;
    ref: "User";
  };
  tender: {
    type: Types.ObjectId;
    ref: "Tender";
  };
}
