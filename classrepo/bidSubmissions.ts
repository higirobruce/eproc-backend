import { Types } from "mongoose";
import { IBidSubmission } from "../interfaces/iBidSubmissions";

export class BidSubmission implements IBidSubmission {
  proposalUrls: string[];
  deliveryDate: Date;
  price: number;
  currency: string;
  warranty: number;
  discount: number;
  status: string;
  comment: string;
  number: number;
  createdBy: Types.ObjectId;
  tender: Types.ObjectId;
  warrantyDuration: String;
  proposalDocId: String;
  otherDocId: String;
  bankName: String;
  bankAccountNumber: String;
  bankAccountName: String;
  deliveryTimeFrameDuration: String;
  deliveryTimeFrame: Number;

  constructor(
    proposalUrls: string[],
    deliveryDate: Date,
    price: number,
    currency: string,
    warranty: number,
    discount: number,
    status: string,
    comment: string,
    number: number,
    createdBy: string,
    tender: string,
    warrantyDuration: string,
    proposalDocId: String,
    otherDocId: String,
    bankName: string,
    bankAccountNumber: string,
    bankAccountName: string,
    deliveryTimeFrameDuration: String,
    deliveryTimeFrame: Number
  ) {
    this.proposalUrls = proposalUrls;
    this.deliveryDate = deliveryDate;
    this.price = price;
    this.currency = currency;
    this.warranty = warranty;
    this.discount = discount;
    this.status = status;
    this.comment = comment;
    this.number = number;
    this.createdBy = createdBy
      ? new Types.ObjectId(createdBy)
      : new Types.ObjectId();
    this.tender = tender ? new Types.ObjectId(tender) : new Types.ObjectId();
    this.warrantyDuration = warrantyDuration;
    this.proposalDocId = proposalDocId;
    this.otherDocId = otherDocId;
    this.bankName = bankName;
    this.bankAccountNumber = bankAccountNumber;
    this.bankAccountName = bankAccountName;
    this.deliveryTimeFrameDuration = deliveryTimeFrameDuration;
    this.deliveryTimeFrame = deliveryTimeFrame;
  }
}
