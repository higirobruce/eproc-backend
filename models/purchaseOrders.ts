import mongoose, { Schema, model, connect, Document, Types } from 'mongoose';
import { IPurchaseOrderDocument } from '../interfaces/iPurchaseOrders';

export const PurchaseOrderSchema = new Schema<IPurchaseOrderDocument>({
    number: Number,
    vendor: {
        type: Types.ObjectId,
        ref: 'User'
    },
    tender:{
        type: Types.ObjectId,
        ref: 'Tender'
    },
    createdBy:{
        type: Types.ObjectId,
        ref: 'User'
    },
    paymentTerms: String,
    status:{
        type: String
    },
    deliveryProgress:{
        type:Number,
        default: 0
    }
})

export const PurchaseOrderModel = model<IPurchaseOrderDocument>('PurchaseOrder', PurchaseOrderSchema);