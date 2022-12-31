import {Document, Types} from "mongoose";
import { PoLineItem } from "../classrepo/poLineItems";
import { ContractStatus } from "../types/types";

export interface IRequest {
    
    items: PoLineItem[],
    dueDate: Date,
    status: ContractStatus,
    attachementUrls: String[],
    number: number

}

export interface IRequestDocument extends IRequest, Document {
    createdBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    
}