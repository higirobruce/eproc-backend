
import { IUserDocument } from '../interfaces/iUsers';
import mongoose, { Schema, model, connect, Document, Types } from 'mongoose';
import { IRequest, IRequestDocument } from '../interfaces/iRequestes';

export const RequestSchema = new Schema<IRequestDocument>({
    createdBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    attachementUrls: Array,
    dueDate: Date,
    items: Array,
    status: {
        type: String,
        default: 'pending'
    },
    number: {
        type: Number
    }
   
})

export const RequestModel = model<IRequestDocument>('Request', RequestSchema);