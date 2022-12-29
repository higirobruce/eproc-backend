import mongoose,{Document} from "mongoose";
import { ContractStatus, ContractType } from "../types/types";

export interface IContract {
    number: number,
    vendor: mongoose.Types.ObjectId,
    startDate: Date,
    endDate: Date,
    description: string,
    type: ContractType,
    status: ContractStatus,
    contractOwner: mongoose.Types.ObjectId
    request: mongoose.Types.ObjectId
    createdBy: mongoose.Types.ObjectId

}

export interface IContractDocument extends IContract, Document {

}