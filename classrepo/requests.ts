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

    constructor(
        createdBy: string,
        items: PoLineItem[],
        dueDate: Date,
        status: ContractStatus,
        attachementUrls: string[],
        number: number
    ) {
        this.createdBy =createdBy?  new Types.ObjectId(createdBy) : new Types.ObjectId()
        this.items = items
        this.dueDate = dueDate
        this.status = status
        this.attachementUrls = attachementUrls
        this.number = number
    }

}