"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRequest = void 0;
class PaymentRequest {
    constructor(number, description, title, amount, docIds, status, rejectionDate, reasonForRejection, hod_approvalDate, hof_approvalDate, reviewedAt, paymentProofDocs) {
        this.number = number;
        this.description = description;
        this.title = title;
        this.amount = amount;
        this.docIds = docIds;
        this.status = status;
        this.reasonForRejection = reasonForRejection;
        this.rejectionDate = rejectionDate;
        this.hod_approvalDate = hod_approvalDate;
        this.hof_approvalDate = hof_approvalDate;
        this.reviewedAt = reviewedAt;
        this.paymentProofDocs = paymentProofDocs;
    }
}
exports.PaymentRequest = PaymentRequest;
