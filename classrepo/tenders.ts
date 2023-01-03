import { Types } from "mongoose";
import { ITender } from "../interfaces/iTenders";
import { ContractStatus } from "../types/types";
import { PoLineItem } from "./poLineItems";


export class Tender implements ITender {
    createdBy: Types.ObjectId;
    items: PoLineItem[];
    dueDate: Date;
    status: ContractStatus;
    attachementUrls: string[];
    number: number;
    submissionDeadLine: Date;
    torsUrl: string;
    purchaseRequest: Types.ObjectId;

    constructor(
        createdBy: string,
        items: PoLineItem[],
        dueDate: Date,
        status: ContractStatus,
        attachementUrls: string[],
        number: number,
        submissionDeadLine: Date,
        torsUrl: string,
        purchaseRequest: string
    ) {
        this.createdBy = createdBy ? new Types.ObjectId(createdBy) : new Types.ObjectId()
        this.items = items
        this.dueDate = dueDate
        this.status = status
        this.attachementUrls = attachementUrls
        this.number = number
        this.submissionDeadLine = submissionDeadLine
        this.torsUrl = torsUrl
        this.purchaseRequest = purchaseRequest? new Types.ObjectId(purchaseRequest) : new Types.ObjectId()
    }


}