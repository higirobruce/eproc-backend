import { iPaymentRequest } from "../interfaces/iPaymentRequests";

export class PaymentRequest implements iPaymentRequest {
  number: number;
  description: string;
  title: string;
  amount: number;
  docIds: [];
  status: string;
  rejectionDate: Date;
  reasonForRejection: string;

  constructor(
    number: number,
    description: string,
    title: string,
    amount: number,
    docIds: [],
    status: string,
    rejectionDate: Date,
    reasonForRejection: string
  ) {
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
