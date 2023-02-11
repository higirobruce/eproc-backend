"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseOrder = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class PurchaseOrder {
    constructor(number, vendor, tender, createdBy, sections, status, deliveryProgress) {
        this.number = number;
        this.vendor = vendor ? new mongoose_1.default.Types.ObjectId(vendor) : new mongoose_1.default.Types.ObjectId();
        this.tender = tender ? new mongoose_1.default.Types.ObjectId(tender) : new mongoose_1.default.Types.ObjectId();
        this.createdBy = createdBy ? new mongoose_1.default.Types.ObjectId(createdBy) : new mongoose_1.default.Types.ObjectId();
        this.sections = sections;
        this.status = status;
        this.deliveryProgress = deliveryProgress;
    }
}
exports.PurchaseOrder = PurchaseOrder;
