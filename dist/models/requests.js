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
        type: String,
    },
    hod_approvalDate: {
        type: Date,
        default: Date.now(),
    },
    hof_approvalDate: {
        type: Date,
        default: Date.now(),
    },
    pm_approvalDate: {
        type: Date,
        default: Date.now(),
    },
    title: {
        type: String,
    },
    level1Approver: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
    },
});
exports.RequestModel = (0, mongoose_1.model)("Request", exports.RequestSchema);
