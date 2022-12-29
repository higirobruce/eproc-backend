"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = void 0;
const mongoose_1 = require("mongoose");
class Contract {
    constructor(number, vendor, startDate, endDate, description, type, status, contractOwner, request, createdBy) {
        this.number = number;
        this.vendor = vendor ? new mongoose_1.Types.ObjectId(vendor) : new mongoose_1.Types.ObjectId();
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
        this.type = type;
        this.status = status;
        this.contractOwner = contractOwner ? new mongoose_1.Types.ObjectId(contractOwner) : new mongoose_1.Types.ObjectId();
        this.request = request ? new mongoose_1.Types.ObjectId(request) : new mongoose_1.Types.ObjectId();
        this.createdBy = createdBy ? new mongoose_1.Types.ObjectId(createdBy) : new mongoose_1.Types.ObjectId();
    }
}
exports.Contract = Contract;
