"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseOrderModel = exports.PurchaseOrderSchema = void 0;
const mongoose_1 = require("mongoose");
exports.PurchaseOrderSchema = new mongoose_1.Schema({
    number: Number,
    vendor: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User'
    },
    tender: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Tender'
    },
    createdBy: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User'
    },
    paymentTerms: String,
    status: {
        type: String
    },
    deliveryProgress: {
        type: Number,
        default: 0
    }
});
exports.PurchaseOrderModel = (0, mongoose_1.model)('PurchaseOrder', exports.PurchaseOrderSchema);
