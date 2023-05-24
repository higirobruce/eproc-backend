"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRequest = void 0;
class PaymentRequest {
    constructor(number, description, title, amount, docIds, status, rejectionDate, reasonForRejection) {
        this.number = number;
        this.description = description;
        this.title = title;
        this.amount = amount;
        this.docIds = docIds;
        this.status = status;
        this.reasonForRejection = reasonForRejection;
        this.rejectionDate = rejectionDate;
    }
}
exports.PaymentRequest = PaymentRequest;
