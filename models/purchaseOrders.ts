import mongoose, { Schema, model, connect, Document } from 'mongoose';
import { IPurchaseOrderDocument } from '../interfaces/iPurchaseOrders';

export const PurchaseOrderSchema = new Schema<IPurchaseOrderDocument>({
    number: Number,
    vendor: mongoose.Types.ObjectId,
    items: Array<mongoose.Types.ObjectId>,
    dueDate: Date,
    contract:mongoose.Types.ObjectId,
    createdBy:mongoose.Types.ObjectId,
    comments: String
})

export const PurchaseOrderModel = model<IPurchaseOrderDocument>('PurchaseOrder', PurchaseOrderSchema);