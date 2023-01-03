"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tender = void 0;
const mongoose_1 = require("mongoose");
class Tender {
    constructor(createdBy, items, dueDate, status, attachementUrls, number, submissionDeadLine, torsUrl, purchaseRequest) {
        this.createdBy = createdBy ? new mongoose_1.Types.ObjectId(createdBy) : new mongoose_1.Types.ObjectId();
        this.items = items;
        this.dueDate = dueDate;
        this.status = status;
        this.attachementUrls = attachementUrls;
        this.number = number;
        this.submissionDeadLine = submissionDeadLine;
        this.torsUrl = torsUrl;
        this.purchaseRequest = purchaseRequest ? new mongoose_1.Types.ObjectId(purchaseRequest) : new mongoose_1.Types.ObjectId();
    }
}
exports.Tender = Tender;
