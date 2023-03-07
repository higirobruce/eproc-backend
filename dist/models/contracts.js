"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractModel = exports.Contract = void 0;
const mongoose_1 = require("mongoose");
exports.Contract = new mongoose_1.Schema({
    number: Number,
    vendor: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
    },
    tender: {
        type: mongoose_1.Types.ObjectId,
        ref: "Tender",
    },
    request: {
        type: mongoose_1.Types.ObjectId,
        ref: "Request",
    },
    createdBy: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
    },
    sections: Array,
    status: {
        type: String,
        default: "draft",
    },
    deliveryProgress: {
        type: Number,
        default: 0,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    signatories: [],
    reqAttachmentDocId: {
        type: String,
    },
});
exports.ContractModel = (0, mongoose_1.model)("Contract", exports.Contract);
