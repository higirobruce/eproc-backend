import { iPaymentRequest } from "../interfaces/iPaymentRequests";

export class PaymentRequest implements iPaymentRequest {
  number: number;
  description: string;
  title: string;
  amount: number;
  docIds: [];
  paymentProofDocs: [];
  status: string;
  rejectionDate: Date;
  hod_approvalDate: Date;
  hof_approvalDate: Date;
  reasonForRejection: string;
  reviewedAt: Date;

  constructor(
    number: number,
    description: string,
    title: string,
    amount: number,
    docIds: [],
    status: string,
    rejectionDate: Date,
    reasonForRejection: string,
    hod_approvalDate: Date,
    hof_approvalDate: Date,
    reviewedAt: Date,
    paymentProofDocs: [],
  ) {
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
    this.paymentProofDocs = paymentProofDocs
  }
}
