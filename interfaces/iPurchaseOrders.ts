import mongoose, { Types } from "mongoose";

export interface IPurchaseOrder {
    number: number,
    sections: [],
    status: String,
    deliveryProgress: number

}

export interface IPurchaseOrderDocument extends IPurchaseOrder, mongoose.Document {
    vendor: {
        type: Types.ObjectId,
        ref: 'Vendors'
    },
    tender: {
        type: Types.ObjectId,
        ref: 'Tenders'
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'Users'
    }
}