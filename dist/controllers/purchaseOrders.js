"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePO = exports.updateProgress = exports.updatePOStatus = exports.getPOByVendorId = exports.getPOByTenderId = exports.getAllPOs = void 0;
const purchaseOrders_1 = require("../models/purchaseOrders");
function getAllPOs() {
    return __awaiter(this, void 0, void 0, function* () {
        let pos = yield purchaseOrders_1.PurchaseOrderModel.find().populate('tender').populate('vendor').populate('createdBy').populate({
            path: "tender",
            populate: {
                path: 'purchaseRequest',
                model: 'Request'
            }
        });
        return pos;
    });
}
exports.getAllPOs = getAllPOs;
function getPOByTenderId(tenderId) {
    return __awaiter(this, void 0, void 0, function* () {
        let pos = yield purchaseOrders_1.PurchaseOrderModel.find({ tender: tenderId }).populate('tender').populate('vendor').populate('createdBy').populate({
            path: "tender",
            populate: {
                path: 'purchaseRequest',
                model: 'Request'
            }
        });
        console.log(tenderId, pos);
        return pos;
    });
}
exports.getPOByTenderId = getPOByTenderId;
function getPOByVendorId(vendorId) {
    return __awaiter(this, void 0, void 0, function* () {
        let pos = yield purchaseOrders_1.PurchaseOrderModel.find({ vendor: vendorId }).populate('tender').populate('vendor').populate('createdBy');
        return pos;
    });
}
exports.getPOByVendorId = getPOByVendorId;
function updatePOStatus(id, newStatus) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield purchaseOrders_1.PurchaseOrderModel.findByIdAndUpdate(id, { $set: { status: newStatus } });
            return { message: 'done' };
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`
            };
        }
    });
}
exports.updatePOStatus = updatePOStatus;
function updateProgress(id, progress) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let a = yield purchaseOrders_1.PurchaseOrderModel.findByIdAndUpdate(id, { $set: { deliveryProgress: progress } }, { returnOriginal: false });
            return a;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`
            };
        }
    });
}
exports.updateProgress = updateProgress;
function savePO(po) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let createdRecord = yield purchaseOrders_1.PurchaseOrderModel.create(po);
            return createdRecord;
        }
        catch (err) {
            throw err;
        }
    });
}
exports.savePO = savePO;
