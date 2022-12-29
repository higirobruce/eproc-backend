"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestModel = exports.RequestSchema = void 0;
const mongoose_1 = require("mongoose");
exports.RequestSchema = new mongoose_1.Schema({
    createdBy: {
        type: mongoose_1.Types.ObjectId,
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
});
exports.RequestModel = (0, mongoose_1.model)('Request', exports.RequestSchema);
