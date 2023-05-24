"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRequestModel = exports.PaymentRequestSchema = void 0;
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = require("mongoose");
exports.PaymentRequestSchema = new mongoose_1.Schema({
    number: Number,
    description: String,
    title: String,
    amount: Number,
    purchaseOrder: {
        type: mongoose_1.Types.ObjectId,
        ref: "PurchaseOrder",
        required: true,
    },
    createdBy: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    approver: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
    },
    docIds: [{ type: String }],
    status: {
        type: String,
        default: "pending-review",
    },
    reasonForRejection: String,
    declinedBy: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
    },
    rejectionDate: {
        type: Date,
        default: (0, moment_1.default)(),
    },
}, { timestamps: true });
exports.PaymentRequestModel = (0, mongoose_1.model)("PaymentRequest", exports.PaymentRequestSchema);
