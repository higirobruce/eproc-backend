import { Schema, model, Types } from "mongoose";
import { IBidSubmissionDocument } from "../interfaces/iBidSubmissions";

export const BidSubmissionSchema = new Schema<IBidSubmissionDocument>({
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
  },
  tender: {
    type: Types.ObjectId,
    ref: "Tender",
  },
  proposalUrls: Array,
  deliveryDate: Date,
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "RWF",
  },
  warranty: {
    type: Number,
  },
  discount: {
    type: Number,
  },
  status: {
    type: String,
    default: "pending",
  },
  comment: {
    type: String,
  },
  number: {
    type: Number,
  },
  warrantyDuration: {
    type: String,
  },
});

export const BidSubmissionModel = model<IBidSubmissionDocument>(
  "BidSubmission",
  BidSubmissionSchema
);
