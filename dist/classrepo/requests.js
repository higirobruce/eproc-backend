"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const mongoose_1 = require("mongoose");
class Request {
    constructor(createdBy, items, dueDate, status, attachementUrls, number, description, serviceCategory, reasonForRejection, declinedBy, budgeted, budgetLine, title, hod_approvalDate, hof_approvalDate, pm_approvalDate) {
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
        this.title = title;
        this.hod_approvalDate = hod_approvalDate;
        this.hof_approvalDate = hof_approvalDate;
        this.pm_approvalDate = pm_approvalDate;
    }
    ;
}
exports.Request = Request;
