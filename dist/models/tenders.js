"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenderModel = exports.TenderSchema = void 0;
const mongoose_1 = require("mongoose");
exports.TenderSchema = new mongoose_1.Schema({
    createdBy: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User'
    },
    attachementUrls: Array,
    dueDate: Date,
    submissionDeadLine: Date,
    purchaseRequest: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Request'
    },
    torsUrl: String,
    items: Array,
    status: {
        type: String,
        default: 'pending'
    },
    number: {
        type: Number
    }
});
exports.TenderModel = (0, mongoose_1.model)('Tender', exports.TenderSchema);
