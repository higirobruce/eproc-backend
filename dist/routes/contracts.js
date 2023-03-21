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
exports.contractRouter = void 0;
const crypto_1 = require("crypto");
const express_1 = require("express");
const contracts_1 = require("../classrepo/contracts");
const contracts_2 = require("../controllers/contracts");
const users_1 = require("../controllers/users");
const contracts_3 = require("../services/contracts");
const users_2 = require("../services/users");
const sendEmailNode_1 = require("../utils/sendEmailNode");
exports.contractRouter = (0, express_1.Router)();
exports.contractRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, contracts_2.getAllContracts)());
}));
exports.contractRouter.get("/byTenderId/:tenderId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { tenderId } = req.params;
    res.send(yield (0, contracts_2.getContractByTenderId)(tenderId));
}));
exports.contractRouter.get("/byRequestId/:requestId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { requestId } = req.params;
    res.send(yield (0, contracts_2.getContractByRequestId)(requestId));
}));
exports.contractRouter.get("/byVendorId/:vendorId/:status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { vendorId, status } = req.params;
    res.send(yield (0, contracts_2.getContractByVendorId)(vendorId, status));
}));
exports.contractRouter.get("/byStatus/:status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { status } = req.params;
    res.send(yield (0, contracts_2.getContractByStatus)(status));
}));
exports.contractRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { vendor, tender, request, createdBy, sections, status, deliveryProgress, contractStartDate, contractEndDate, signatories, reqAttachmentDocId, } = req.body;
    let number = yield (0, contracts_3.generateContractNumber)();
    let contractToCreate = new contracts_1.Contract(tender, number, vendor, request, createdBy, sections, status, deliveryProgress, contractStartDate, contractEndDate, signatories, reqAttachmentDocId);
    let createdContract = yield (0, contracts_2.saveContract)(contractToCreate);
    res.status(201).send(createdContract);
}));
exports.contractRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    let { id } = req.params;
    let { newContract, pending, paritallySigned, signed } = req.body;
    let vendor = yield (0, users_1.getVendorByCompanyName)((_b = newContract === null || newContract === void 0 ? void 0 : newContract.signatories[((_a = newContract === null || newContract === void 0 ? void 0 : newContract.signatories) === null || _a === void 0 ? void 0 : _a.length) - 1]) === null || _b === void 0 ? void 0 : _b.onBehalfOf);
    if (pending) {
        newContract.status = "pending-signature";
    }
    if (paritallySigned) {
        newContract.status = "partially-signed";
        // console.log(vendor);
        let _vendor = Object.assign({}, vendor);
        let tempPass = (0, crypto_1.randomUUID)();
        _vendor.tempEmail =
            (_d = newContract === null || newContract === void 0 ? void 0 : newContract.signatories[((_c = newContract === null || newContract === void 0 ? void 0 : newContract.signatories) === null || _c === void 0 ? void 0 : _c.length) - 1]) === null || _d === void 0 ? void 0 : _d.email;
        _vendor.tempPassword = (0, users_2.hashPassword)(tempPass);
        yield (0, users_1.setTempFields)(vendor === null || vendor === void 0 ? void 0 : vendor._id, _vendor === null || _vendor === void 0 ? void 0 : _vendor.tempEmail, _vendor === null || _vendor === void 0 ? void 0 : _vendor.tempPassword);
        (0, sendEmailNode_1.send)("from", _vendor.tempEmail, "Your contract has been signed", JSON.stringify({ email: _vendor.tempEmail, password: tempPass }), "", "externalSignature");
    }
    if (signed) {
        newContract.status = "signed";
    }
    let updated = yield (0, contracts_2.updateContract)(id, newContract);
    res.status(200).send(updated);
}));
