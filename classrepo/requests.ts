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
    title: string;
    hod_approvalDate: Date;
    hof_approvalDate: Date;
    pm_approvalDate: Date;
    


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
        title: string,
        hod_approvalDate: Date,
    hof_approvalDate: Date,
    pm_approvalDate: Date,
    
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
        this.title = title
        this.hod_approvalDate = hod_approvalDate
        this.hof_approvalDate = hof_approvalDate
        this.pm_approvalDate = pm_approvalDate
    }
    
;

}