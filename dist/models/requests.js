"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestModel = exports.RequestSchema = void 0;
const mongoose_1 = require("mongoose");
exports.RequestSchema = new mongoose_1.Schema({
    createdBy: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
    },
    attachementUrls: Array,
    dueDate: Date,
    items: Array,
    status: {
        type: String,
        default: "pending",
    },
    number: {
        type: Number,
    },
    description: {
        type: String,
    },
    serviceCategory: {
        type: String,
    },
    reasonForRejection: {
        type: String,
    },
    declinedBy: {
        type: String,
    },
    budgeted: {
        type: Boolean,
    },
    budgetLine: {
        type: mongoose_1.Types.ObjectId,
        ref: "BudgetLine",
    },
    hod_approvalDate: {
        type: Date
    },
    hof_approvalDate: {
        type: Date,
    },
    pm_approvalDate: {
        type: Date
    },
    rejectionDate: {
        type: Date
    },
    title: {
        type: String,
    },
    level1Approver: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
    },
    sourcingMethod: {
        type: String,
    },
}, { timestamps: true });
exports.RequestModel = (0, mongoose_1.model)("Request", exports.RequestSchema);
