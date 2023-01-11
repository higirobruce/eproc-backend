"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidSubmissionModel = exports.BidSubmissionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.BidSubmissionSchema = new mongoose_1.Schema({
    createdBy: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User'
    },
    tender: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Tender'
    },
    proposalUrls: Array,
    deliveryDate: Date,
    price: {
        type: Number,
        required: true
    },
    warranty: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    status: {
        type: String,
        default: 'pending'
    },
    comment: {
        type: String,
    },
    number: {
        type: Number
    }
});
exports.BidSubmissionModel = (0, mongoose_1.model)('BidSubmission', exports.BidSubmissionSchema);
