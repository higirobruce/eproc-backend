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
const crypto_1 = require("crypto");
const express_1 = require("express");
const purchaseOrders_1 = require("../classrepo/purchaseOrders");
const purchaseOrders_2 = require("../controllers/purchaseOrders");
const users_1 = require("../controllers/users");
const b1_1 = require("../services/b1");
const purchaseOrders_3 = require("../services/purchaseOrders");
const users_2 = require("../services/users");
const sendEmailNode_1 = require("../utils/sendEmailNode");
exports.poRouter = (0, express_1.Router)();
exports.poRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, purchaseOrders_2.getAllPOs)());
}));
exports.poRouter.get("/byTenderId/:tenderId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { tenderId } = req.params;
    res.send(yield (0, purchaseOrders_2.getPOByTenderId)(tenderId));
}));
exports.poRouter.get("/byRequestId/:requestId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { requestId } = req.params;
    res.send(yield (0, purchaseOrders_2.getPOByRequestId)(requestId));
}));
exports.poRouter.get("/byVendorId/:vendorId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { vendorId } = req.params;
    res.send(yield (0, purchaseOrders_2.getPOByVendorId)(vendorId));
}));
exports.poRouter.post("/", (req, response) => __awaiter(void 0, void 0, void 0, function* () {
    let { vendor, tender, request, createdBy, sections, items, status, deliveryProgress, B1Data, signatories, reqAttachmentDocId, rate, rateComment } = req.body;
    let { B1Data_Assets, B1Data_NonAssets } = B1Data;
    let CardCode;
    yield (0, b1_1.getBusinessPartnerByName)((B1Data_Assets === null || B1Data_Assets === void 0 ? void 0 : B1Data_Assets.CardName) || B1Data_NonAssets.CardName).then((res) => __awaiter(void 0, void 0, void 0, function* () {
        let bp = res.value;
        if ((bp === null || bp === void 0 ? void 0 : bp.length) >= 1) {
            CardCode = bp[0].CardCode;
            let b1Response_assets = B1Data_Assets
                ? yield (0, purchaseOrders_2.savePOInB1)(CardCode, B1Data_Assets.DocType, B1Data_Assets.DocumentLines)
                : null;
            let b1Response_nonAssets = B1Data_NonAssets
                ? yield (0, purchaseOrders_2.savePOInB1)(CardCode, B1Data_NonAssets.DocType, B1Data_NonAssets.DocumentLines)
                : null;
            if ((b1Response_assets === null || b1Response_assets === void 0 ? void 0 : b1Response_assets.error) || (b1Response_nonAssets === null || b1Response_nonAssets === void 0 ? void 0 : b1Response_nonAssets.error)) {
                response.status(201).send((b1Response_assets === null || b1Response_assets === void 0 ? void 0 : b1Response_assets.error) || (b1Response_nonAssets === null || b1Response_nonAssets === void 0 ? void 0 : b1Response_nonAssets.error));
            }
            else {
                let number = yield (0, purchaseOrders_3.generatePONumber)();
                let refs = [];
                b1Response_assets && refs.push(b1Response_assets.DocNum);
                b1Response_nonAssets && refs.push(b1Response_nonAssets.DocNum);
                let poToCreate = new purchaseOrders_1.PurchaseOrder(number, vendor, tender, request, createdBy, sections, items, status, deliveryProgress, signatories, reqAttachmentDocId, refs, rate, rateComment);
                let createdPO = yield (0, purchaseOrders_2.savePO)(poToCreate);
                if (createdPO) {
                    if ((refs === null || refs === void 0 ? void 0 : refs.length) >= 1) {
                        refs.forEach((r) => __awaiter(void 0, void 0, void 0, function* () {
                            yield (0, purchaseOrders_2.updateB1Po)(r, {
                                Comments: `Refer to PO number ${createdPO === null || createdPO === void 0 ? void 0 : createdPO.number} in the e-procurement tool.`,
                            });
                        }));
                    }
                }
                response.status(201).send({ createdTender: createdPO });
            }
        }
        else {
            response
                .status(500)
                .send({ error: true, message: "Business Partner not found!" });
        }
    })).catch(err => {
        console.log(err);
    });
}));
exports.poRouter.put("/status/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let { status } = req.body;
    res.send(yield (0, purchaseOrders_2.updatePOStatus)(id, status));
}));
exports.poRouter.put("/progress/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let { updates } = req.body;
    res.send(yield (0, purchaseOrders_2.updateProgress)(id, updates));
}));
exports.poRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    let { id } = req.params;
    let { newPo, pending, paritallySigned, signed } = req.body;
    let vendor = yield (0, users_1.getVendorByCompanyName)((_b = newPo === null || newPo === void 0 ? void 0 : newPo.signatories[((_a = newPo === null || newPo === void 0 ? void 0 : newPo.signatories) === null || _a === void 0 ? void 0 : _a.length) - 1]) === null || _b === void 0 ? void 0 : _b.onBehalfOf);
    if (pending) {
        newPo.status = "pending-signature";
    }
    if (paritallySigned) {
        newPo.status = "partially-signed";
        // console.log(vendor);
        let _vendor = Object.assign({}, vendor);
        let tempPass = (0, crypto_1.randomUUID)();
        _vendor.tempEmail =
            (_d = newPo === null || newPo === void 0 ? void 0 : newPo.signatories[((_c = newPo === null || newPo === void 0 ? void 0 : newPo.signatories) === null || _c === void 0 ? void 0 : _c.length) - 1]) === null || _d === void 0 ? void 0 : _d.email;
        _vendor.tempPassword = (0, users_2.hashPassword)(tempPass);
        yield (0, users_1.setTempFields)(vendor === null || vendor === void 0 ? void 0 : vendor._id, _vendor === null || _vendor === void 0 ? void 0 : _vendor.tempEmail, _vendor === null || _vendor === void 0 ? void 0 : _vendor.tempPassword);
        (0, sendEmailNode_1.send)("from", _vendor.tempEmail, "Your Purchase Order has been signed", JSON.stringify({ email: _vendor.tempEmail, password: tempPass }), "", "externalSignaturePO");
    }
    if (signed) {
        newPo.status = "signed";
    }
    let updated = yield (0, purchaseOrders_2.updatePo)(id, newPo);
    res.status(200).send(updated);
}));
