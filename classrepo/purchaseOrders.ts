import mongoose from "mongoose";
import { IPurchaseOrder } from "../interfaces/iPurchaseOrders";

export class PurchaseOrder implements IPurchaseOrder {
  number: number;
  vendor: mongoose.Types.ObjectId;
  tender: mongoose.Types.ObjectId;
  request: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  sections: [];
  items: [];
  status: String;
  deliveryProgress: number;
  signatories: [];
  reqAttachmentDocId: string;
  referenceDocs: string[];
  rate: number

  constructor(
    number: number,
    vendor: string,
    tender: string,
    request: string,
    createdBy: string,
    sections: [],
    items: [],
    status: string,
    deliveryProgress: number,
    signatories: [],
    reqAttachmentDocId: string,
    referenceDocs: string[],
    rate: number
  ) {
    this.number = number;
    this.vendor = vendor
      ? new mongoose.Types.ObjectId(vendor)
      : new mongoose.Types.ObjectId();
    this.tender = tender
      ? new mongoose.Types.ObjectId(tender)
      : new mongoose.Types.ObjectId();
    this.request = request
      ? new mongoose.Types.ObjectId(request)
      : new mongoose.Types.ObjectId();
    this.createdBy = createdBy
      ? new mongoose.Types.ObjectId(createdBy)
      : new mongoose.Types.ObjectId();
    this.sections = sections;
    this.items = items;
    this.status = status;
    this.deliveryProgress = deliveryProgress;
    this.signatories = signatories;
    this.reqAttachmentDocId = reqAttachmentDocId
    this.referenceDocs = referenceDocs;
    this.rate = rate
  }
  
}
