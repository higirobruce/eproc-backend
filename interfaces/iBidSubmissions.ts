import {Document, Types} from "mongoose";

export interface IBidSubmission {
    
    proposalUrls: String[],
    deliveryDate: Date,
    price: number,
    currency: String,
    warranty: number,
    warrantyDuration: String,
    discount: number,
    status: String,
    comment: String,
    number: number

}

export interface IBidSubmissionDocument extends IBidSubmission, Document {
    createdBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    tender: {
        type: Types.ObjectId,
        ref: 'Tender'
    },
    
}