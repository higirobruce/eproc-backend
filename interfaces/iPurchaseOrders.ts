import mongoose from "mongoose";
import { PoLineItem } from "../classrepo/poLineItems";
import { iItem } from "./iItems";

export interface IPurchaseOrder {
    number: number,
    vendor: mongoose.Types.ObjectId,
    items : Array<PoLineItem>,
    dueDate: Date,
    comments: string
    contract: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
}

export interface IPurchaseOrderDocument extends IPurchaseOrder, mongoose.Document {
    
}