"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseOrder = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class PurchaseOrder {
    constructor(number, vendor, tender, request, createdBy, sections, items, status, deliveryProgress, signatories, reqAttachmentDocId, referenceDocs, rate, rateComment) {
        this.number = number;
        this.vendor = vendor
            ? new mongoose_1.default.Types.ObjectId(vendor)
            : new mongoose_1.default.Types.ObjectId();
        this.tender = tender
            ? new mongoose_1.default.Types.ObjectId(tender)
            : new mongoose_1.default.Types.ObjectId();
        this.request = request
            ? new mongoose_1.default.Types.ObjectId(request)
            : new mongoose_1.default.Types.ObjectId();
        this.createdBy = createdBy
            ? new mongoose_1.default.Types.ObjectId(createdBy)
            : new mongoose_1.default.Types.ObjectId();
        this.sections = sections;
        this.items = items;
        this.status = status;
        this.deliveryProgress = deliveryProgress;
        this.signatories = signatories;
        this.reqAttachmentDocId = reqAttachmentDocId;
        this.referenceDocs = referenceDocs;
        this.rate = rate;
        this.rateComment = rateComment;
    }
}
exports.PurchaseOrder = PurchaseOrder;
