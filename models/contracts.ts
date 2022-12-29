import mongoose, { Schema, model, connect, Document } from 'mongoose';
import { IContractDocument } from '../interfaces/iContracts';

export const Contract = new Schema<IContractDocument>({
    number: Number,
    vendor: mongoose.Types.ObjectId,
    startDate: Date,
    endDate: Date,
    description: String,
    type: String,
    status: String,
    contractOwner: mongoose.Types.ObjectId,
    request: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId

})

export const ContractModel = model<IContractDocument>('Contract', Contract);