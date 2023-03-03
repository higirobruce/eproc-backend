import {Document, Types} from "mongoose";
import { PoLineItem } from "../classrepo/poLineItems";
import { ContractStatus } from "../types/types";

export interface ITender {
    
    items: PoLineItem[],
    dueDate: Date,
    submissionDeadLine: Date,
    status: ContractStatus,
    attachementUrls: String[],
    torsUrl: String,
    number: number,
    invitationSent: Boolean,
    invitees: [],
    docId: string
    evaluationReportId: string

}

export interface ITenderDocument extends ITender, Document {
    createdBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    purchaseRequest: {
        type: Types.ObjectId,
        ref: 'Request'
    },
    
}