import mongoose, { Schema } from "mongoose";
import { IPurchaseOrder } from "../interfaces/iPurchaseOrders";
import { PoLineItem } from "./poLineItems";


export class PurchaseOrder implements IPurchaseOrder {
    number: number;
    vendor: mongoose.Types.ObjectId;
    items: PoLineItem[];
    dueDate: Date;
    comments: string;
    contract: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;

    constructor(
        number: number,
        vendor: string,
        items: PoLineItem[],
        dueDate: Date,
        comments: string,
        contract: string,
        createdBy: string,
    ) {
        this.number = number;
        this.vendor = vendor ? new mongoose.Types.ObjectId(vendor) : new mongoose.Types.ObjectId();
        this.dueDate = dueDate;
        this.items = items;
        this.comments = comments;
        this.contract = contract ? new mongoose.Types.ObjectId(contract) : new mongoose.Types.ObjectId();
        this.createdBy = createdBy ? new mongoose.Types.ObjectId(createdBy) : new mongoose.Types.ObjectId();
    }
}