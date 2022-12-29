import { Types } from "mongoose";
import { IContract } from "../interfaces/iContracts";
import { ContractType, ContractStatus } from "../types/types";


export class Contract implements IContract {
    number: number;
    vendor: Types.ObjectId;
    startDate: Date;
    endDate: Date;
    description: string;
    type: ContractType;
    status: ContractStatus;
    contractOwner: Types.ObjectId;
    request: Types.ObjectId;
    createdBy: Types.ObjectId;

    constructor(
        number: number,
        vendor: string,
        startDate: Date,
        endDate: Date,
        description: string,
        type: ContractType,
        status: ContractStatus,
        contractOwner: string,
        request: string,
        createdBy: string,
    ) {
        this.number = number;
        this.vendor = vendor ? new Types.ObjectId(vendor) :new Types.ObjectId();
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
        this.type = type;
        this.status = status;
        this.contractOwner = contractOwner ? new Types.ObjectId(contractOwner) : new Types.ObjectId()
        this.request = request ? new Types.ObjectId(request) : new Types.ObjectId()
        this.createdBy = createdBy ? new Types.ObjectId(createdBy) : new Types.ObjectId()
    }

}