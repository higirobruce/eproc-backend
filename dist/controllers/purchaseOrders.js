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
exports.savePO = exports.getAllPOs = void 0;
const purchaseOrders_1 = require("../models/purchaseOrders");
function getAllPOs() {
    return __awaiter(this, void 0, void 0, function* () {
        let pos = yield purchaseOrders_1.PurchaseOrderModel.find();
        return pos;
    });
}
exports.getAllPOs = getAllPOs;
function savePO(po) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield purchaseOrders_1.PurchaseOrderModel.create(po);
            return 'Done';
        }
        catch (err) {
            throw err;
        }
    });
}
exports.savePO = savePO;
