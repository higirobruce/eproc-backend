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
    request:{
        type: Types.ObjectId,
        ref: 'Request'
    },

    createdBy:{
        type: Types.ObjectId,
        ref: 'User'
    },
    sections: Array,
    items: Array,
    status:{
        type: String
    },
    deliveryProgress:{
        type:Number,
        default: 0
    },
    signatories:[],
    reqAttachmentDocId: {
        type: String
    },
    referenceDocs:[],
    rate: {
        type: Number,
        default: 2.5
    }
})

export const PurchaseOrderModel = model<IPurchaseOrderDocument>('PurchaseOrder', PurchaseOrderSchema);