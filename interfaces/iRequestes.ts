import {Document, Types} from "mongoose";
import { PoLineItem } from "../classrepo/poLineItems";
import { ContractStatus } from "../types/types";

export interface IRequest {
    
    items: PoLineItem[],
    dueDate: Date,
    status: ContractStatus,
    attachementUrls: String[],
    number: number,
    description: String,
    serviceCategory: String,
    reasonForRejection: String,
    declinedBy: String,
    budgeted: boolean,
    budgetLine: String,
    approvalDate: Date,
    title: String
}

export interface IRequestDocument extends IRequest, Document {
    createdBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    
}