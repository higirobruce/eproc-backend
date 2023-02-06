import { Types } from "mongoose";
import { IBidSubmission } from "../interfaces/iBidSubmissions";


export class BidSubmission implements IBidSubmission {
    proposalUrls: string[];
    deliveryDate: Date;
    price: number;
    warranty: number;
    discount: number;
    status: string;
    comment: string;
    number: number;
    createdBy: Types.ObjectId;
    tender: Types.ObjectId;
    warrantyDuration: String;
    

    constructor(
        proposalUrls: string[],
        deliveryDate: Date,
        price: number,
        warranty: number,
        discount: number,
        status: string,
        comment: string,
        number: number,
        createdBy: string,
        tender: string,
        warrantyDuration: string) {

        this.proposalUrls = proposalUrls
        this.deliveryDate = deliveryDate
        this.price = price
        this.warranty = warranty
        this.discount = discount
        this.status = status
        this.comment = comment
        this.number = number
        this.createdBy = createdBy ? new Types.ObjectId(createdBy) : new Types.ObjectId()
        this.tender = tender ? new Types.ObjectId(tender) : new Types.ObjectId()
        this.warrantyDuration = warrantyDuration
    }
    

}