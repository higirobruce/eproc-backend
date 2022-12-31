"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoLineItem = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class PoLineItem {
    constructor(itemId, quantity, serviceCategory, estimatedUnitCost, currency, description, techSpecs, tors, referenceLinks, budgetLine, budgeted, lineOfBusiness) {
        this.itemId = itemId ? new mongoose_1.default.Types.ObjectId(itemId) : new mongoose_1.default.Types.ObjectId();
        this.quantity = quantity;
        this.serviceCategory = serviceCategory;
        this.estimatedUnitCost = estimatedUnitCost;
        this.currency = currency ? currency : 'RWF';
        this.description = description;
        this.techSpecs = techSpecs;
        this.tors = tors;
        this.referenceLinks = referenceLinks;
        this.budgetLine = budgetLine;
        this.budgeted = budgeted;
        this.lineOfBusiness = lineOfBusiness;
    }
}
exports.PoLineItem = PoLineItem;
