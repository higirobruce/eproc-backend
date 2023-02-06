import mongoose from "mongoose";
import { IPurchaseOrder } from "../interfaces/iPurchaseOrders";


export class PurchaseOrder implements IPurchaseOrder {
    number: number;
    vendor: mongoose.Types.ObjectId;
    tender: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    paymentTerms: string;
    status: String;
    deliveryProgress: number;

    constructor(
        number: number,
        vendor: string,
        tender: string,
        createdBy: string,
        paymentTerms: string,
        status: string,
        deliveryProgress: number
    ) {
        this.number = number;
        this.vendor = vendor ? new mongoose.Types.ObjectId(vendor) : new mongoose.Types.ObjectId();
        this.tender = tender ? new mongoose.Types.ObjectId(tender) : new mongoose.Types.ObjectId();
        this.createdBy = createdBy ? new mongoose.Types.ObjectId(createdBy) : new mongoose.Types.ObjectId();
        this.paymentTerms = paymentTerms
        this.status = status
        this.deliveryProgress=deliveryProgress
    }
    
}