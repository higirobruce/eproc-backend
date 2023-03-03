"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = void 0;
const mongoose_1 = require("mongoose");
class Contract {
    constructor(tender, number, vendor, request, createdBy, sections, status, deliveryProgress, startDate, endDate, signatories) {
        this.number = number;
        this.vendor = vendor ? new mongoose_1.Types.ObjectId(vendor) : new mongoose_1.Types.ObjectId();
        this.tender = tender ? new mongoose_1.Types.ObjectId(tender) : new mongoose_1.Types.ObjectId();
        this.request = request ? new mongoose_1.Types.ObjectId(request) : new mongoose_1.Types.ObjectId();
        this.createdBy = createdBy
            ? new mongoose_1.Types.ObjectId(createdBy)
            : new mongoose_1.Types.ObjectId();
        this.sections = sections;
        this.status = status;
        this.deliveryProgress = deliveryProgress;
        this.startDate = startDate;
        this.endDate = endDate;
        this.signatories = signatories;
    }
}
exports.Contract = Contract;
