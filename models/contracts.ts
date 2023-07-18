import { Schema, model, Types } from "mongoose";
import { IContractDocument } from "../interfaces/iContracts";

export const Contract = new Schema<IContractDocument>({
  number: Number,
  vendor: {
    type: Types.ObjectId,
    ref: "User",
  },
  tender: {
    type: Types.ObjectId,
    ref: "Tender",
  },
  request: {
    type: Types.ObjectId,
    ref: "Request",
  },
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
  },
  sections: Array,
  status: {
    type: String,
    default: "draft",
  },
  deliveryProgress: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  signatories: [],
  reqAttachmentDocId: {
    type: String,
  },
},{timestamps: true});

export const ContractModel = model<IContractDocument>("Contract", Contract);
