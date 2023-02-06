"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const mongoose_1 = require("mongoose");
class Request {
    constructor(createdBy, items, dueDate, status, attachementUrls, number, description, serviceCategory, reasonForRejection, declinedBy, budgeted, budgetLine, approvalDate, title) {
        this.createdBy = createdBy ? new mongoose_1.Types.ObjectId(createdBy) : new mongoose_1.Types.ObjectId();
        this.items = items;
        this.dueDate = dueDate;
        this.status = status;
        this.attachementUrls = attachementUrls;
        this.number = number;
        this.description = description;
        this.serviceCategory = serviceCategory;
        this.reasonForRejection = reasonForRejection;
        this.declinedBy = declinedBy;
        this.budgeted = budgeted;
        this.budgetLine = budgetLine;
        this.approvalDate = approvalDate;
        this.title = title;
    }
    ;
}
exports.Request = Request;
