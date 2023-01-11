"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidSubmission = void 0;
const mongoose_1 = require("mongoose");
class BidSubmission {
    constructor(proposalUrls, deliveryDate, price, warranty, discount, status, comment, number, createdBy, tender) {
        this.proposalUrls = proposalUrls;
        this.deliveryDate = deliveryDate;
        this.price = price;
        this.warranty = warranty;
        this.discount = discount;
        this.status = status;
        this.comment = comment;
        this.number = number;
        this.createdBy = createdBy ? new mongoose_1.Types.ObjectId(createdBy) : new mongoose_1.Types.ObjectId();
        this.tender = tender ? new mongoose_1.Types.ObjectId(tender) : new mongoose_1.Types.ObjectId();
    }
}
exports.BidSubmission = BidSubmission;