import {Document, Types} from "mongoose";

export interface IContract {
    number: number,
    sections: [],
    status: String,
    deliveryProgress: number

}

export interface IContractDocument extends IContract, Document {
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