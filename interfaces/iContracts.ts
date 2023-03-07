import { Document, Types } from "mongoose";

export interface IContract {
  number: number;
  sections: [];
  status: String;
  deliveryProgress: number;
  startDate: Date;
  endDate: Date;
  signatories: [];
  reqAttachmentDocId: String
}

export interface IContractDocument extends IContract, Document {
  vendor: {
    type: Types.ObjectId;
    ref: "Vendors";
  };
  tender: {
    type: Types.ObjectId;
    ref: "Tenders";
  };
  request: {
    type: Types.ObjectId;
    ref: "Request";
  };
  createdBy: {
    type: Types.ObjectId;
    ref: "Users";
  };
}
