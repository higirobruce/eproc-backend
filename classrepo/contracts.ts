import { Types } from "mongoose";
import { IContract } from "../interfaces/iContracts";
import { ContractType, ContractStatus } from "../types/types";

export class Contract implements IContract {
  number: number;
  vendor: Types.ObjectId;
  tender: Types.ObjectId;
  request: Types.ObjectId;
  createdBy: Types.ObjectId;
  sections: [];
  status: String;
  deliveryProgress: number;
  startDate: Date;
  endDate: Date;
  signatories: [];

  constructor(
    tender: string,
    number: number,
    vendor: string,
    request: string,
    createdBy: string,
    sections: [],
    status: string,
    deliveryProgress: number,
    startDate: Date,
    endDate: Date,
    signatories: []
  ) {
    this.number = number;
    this.vendor = vendor ? new Types.ObjectId(vendor) : new Types.ObjectId();
    this.tender = tender ? new Types.ObjectId(tender) : new Types.ObjectId();
    this.request = request ? new Types.ObjectId(request) : new Types.ObjectId();
    this.createdBy = createdBy
      ? new Types.ObjectId(createdBy)
      : new Types.ObjectId();
    this.sections = sections;
    this.status = status;
    this.deliveryProgress = deliveryProgress;
    this.startDate = startDate;
    this.endDate = endDate;
    this.signatories = signatories
  }
  
}
