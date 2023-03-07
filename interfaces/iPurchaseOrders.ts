import mongoose, { Types } from "mongoose";

export interface IPurchaseOrder {
  number: number;
  sections: [];
  items: [];
  status: String;
  deliveryProgress: number;
  signatories: [];
  reqAttachmentDocId: String
}

export interface IPurchaseOrderDocument
  extends IPurchaseOrder,
    mongoose.Document {
  vendor: {
    type: Types.ObjectId;
    ref: "Vendor";
  };
  tender: {
    type: Types.ObjectId;
    ref: "Tender";
  };
  request: {
    type: Types.ObjectId;
    ref: "Request";
  };
  createdBy: {
    type: Types.ObjectId;
    ref: "User";
  };
}
