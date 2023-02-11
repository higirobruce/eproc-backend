import { Schema, model, Types } from 'mongoose';
import { IContractDocument } from '../interfaces/iContracts';

export const Contract = new Schema<IContractDocument>({
    number: Number,
    vendor: {
        type: Types.ObjectId,
        ref: 'User'
    },
    tender: {
        type: Types.ObjectId,
        ref: 'Tender'
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    sections: Array,
    status: {
        type: String
    },
    deliveryProgress: {
        type: Number,
        default: 0
    }

})

export const ContractModel = model<IContractDocument>('Contract', Contract);