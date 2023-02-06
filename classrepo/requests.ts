import { Types } from "mongoose";
import { IRequest } from "../interfaces/iRequestes";
import { ContractStatus } from "../types/types";
import { PoLineItem } from "./poLineItems";


export class Request implements IRequest {
    createdBy: Types.ObjectId;
    items: PoLineItem[];
    dueDate: Date;
    status: ContractStatus;
    attachementUrls: string[];
    number: number
    description: string;
    serviceCategory: string;
    reasonForRejection: string;
    declinedBy: string;
    budgeted: boolean;
    budgetLine: String;
    approvalDate: Date;
    title: string


    constructor(
        createdBy: string,
        items: PoLineItem[],
        dueDate: Date,
        status: ContractStatus,
        attachementUrls: string[],
        number: number,
        description: string,
        serviceCategory: string,
        reasonForRejection: string,
        declinedBy: string,
        budgeted: boolean,
        budgetLine: string,
        approvalDate: Date,
        title: string
    ) {
        this.createdBy = createdBy ? new Types.ObjectId(createdBy) : new Types.ObjectId()
        this.items = items
        this.dueDate = dueDate
        this.status = status
        this.attachementUrls = attachementUrls
        this.number = number
        this.description = description
        this.serviceCategory = serviceCategory
        this.reasonForRejection = reasonForRejection
        this.declinedBy = declinedBy
        this.budgeted = budgeted
        this.budgetLine = budgetLine
        this.approvalDate = approvalDate
        this.title = title
    }
    
;

}