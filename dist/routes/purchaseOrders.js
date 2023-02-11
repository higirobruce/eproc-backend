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
exports.poRouter = void 0;
const express_1 = require("express");
const purchaseOrders_1 = require("../classrepo/purchaseOrders");
const purchaseOrders_2 = require("../controllers/purchaseOrders");
const purchaseOrders_3 = require("../services/purchaseOrders");
exports.poRouter = (0, express_1.Router)();
exports.poRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, purchaseOrders_2.getAllPOs)());
}));
exports.poRouter.get('/byTenderId/:tenderId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { tenderId } = req.params;
    res.send(yield (0, purchaseOrders_2.getPOByTenderId)(tenderId));
}));
exports.poRouter.get('/byVendorId/:vendorId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { vendorId } = req.params;
    res.send(yield (0, purchaseOrders_2.getPOByVendorId)(vendorId));
}));
exports.poRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { vendor, tender, createdBy, sections, status, deliveryProgress } = req.body;
    let number = yield (0, purchaseOrders_3.generatePONumber)();
    let tenderToCreate = new purchaseOrders_1.PurchaseOrder(number, vendor, tender, createdBy, sections, status, deliveryProgress);
    let createdTender = yield (0, purchaseOrders_2.savePO)(tenderToCreate);
    res.status(201).send(createdTender);
}));
exports.poRouter.put('/status/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let { status } = req.body;
    res.send(yield (0, purchaseOrders_2.updatePOStatus)(id, status));
}));
exports.poRouter.put('/progress/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let { deliveryProgress } = req.body;
    res.send(yield (0, purchaseOrders_2.updateProgress)(id, deliveryProgress));
}));
