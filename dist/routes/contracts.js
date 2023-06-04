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
const logger_1 = require("../utils/logger");
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
exports.contractRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    res.send(yield (0, contracts_2.getContractById)(id));
}));
exports.contractRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { vendor, tender, request, createdBy, sections, status, deliveryProgress, contractStartDate, contractEndDate, signatories, reqAttachmentDocId, } = req.body;
    let number = yield (0, contracts_3.generateContractNumber)();
    let contractToCreate = new contracts_1.Contract(tender, number, vendor, request, createdBy, sections, status, deliveryProgress, contractStartDate, contractEndDate, signatories, reqAttachmentDocId);
    let createdContract = yield (0, contracts_2.saveContract)(contractToCreate);
    if (createdContract) {
        logger_1.logger.log({
            level: "info",
            message: `Contract ${createdContract === null || createdContract === void 0 ? void 0 : createdContract._id} successfully created`,
        });
    }
    res.status(201).send(createdContract);
}));
exports.contractRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    let { id } = req.params;
    let { newContract, pending, paritallySigned, signed, previousStatus, signingIndex, } = req.body;
    let logOptions = {};
    let vendor = yield (0, users_1.getVendorByCompanyName)((_b = newContract === null || newContract === void 0 ? void 0 : newContract.signatories[((_a = newContract === null || newContract === void 0 ? void 0 : newContract.signatories) === null || _a === void 0 ? void 0 : _a.length) - 1]) === null || _b === void 0 ? void 0 : _b.onBehalfOf);
    let nextSignatory = (newContract === null || newContract === void 0 ? void 0 : newContract.signatories.length) >= signingIndex + 2
        ? (_c = newContract.signatories[signingIndex + 1]) === null || _c === void 0 ? void 0 : _c.email
        : null;
    if (previousStatus == "draft") {
        (0, sendEmailNode_1.send)("from", (_d = newContract === null || newContract === void 0 ? void 0 : newContract.signatories[0]) === null || _d === void 0 ? void 0 : _d.email, "Your Signature is needed", JSON.stringify({ docId: newContract === null || newContract === void 0 ? void 0 : newContract._id, docType: "contracts" }), "", "internalSignature");
    }
    if (pending) {
        newContract.status = "pending-signature";
        logOptions = {
            level: "info",
            message: `Contract ${id} set to pending-singature status`,
        };
    }
    if (paritallySigned) {
        newContract.status = "partially-signed";
        logOptions = {
            level: "info",
            message: `Contract ${id} set to partially-signed status`,
        };
        // console.log(vendor);
        let _vendor = Object.assign({}, vendor);
        let tempPass = (0, crypto_1.randomUUID)();
        _vendor.tempEmail =
            (_f = newContract === null || newContract === void 0 ? void 0 : newContract.signatories[((_e = newContract === null || newContract === void 0 ? void 0 : newContract.signatories) === null || _e === void 0 ? void 0 : _e.length) - 1]) === null || _f === void 0 ? void 0 : _f.email;
        _vendor.tempPassword = (0, users_2.hashPassword)(tempPass);
        yield (0, users_1.setTempFields)(vendor === null || vendor === void 0 ? void 0 : vendor._id, _vendor === null || _vendor === void 0 ? void 0 : _vendor.tempEmail, _vendor === null || _vendor === void 0 ? void 0 : _vendor.tempPassword);
        (0, sendEmailNode_1.send)("from", _vendor.tempEmail, "Your contract has been signed", JSON.stringify({
            email: _vendor.tempEmail,
            password: tempPass,
            docType: "contracts",
            docId: newContract === null || newContract === void 0 ? void 0 : newContract._id,
        }), "", "externalSignature");
    }
    if (signed) {
        newContract.status = "signed";
        logOptions = {
            level: "info",
            message: `Contract ${id} set to signed status`,
        };
    }
    if (nextSignatory && !paritallySigned) {
        (0, sendEmailNode_1.send)("from", nextSignatory, "Your Signature is needed", JSON.stringify({ docId: newContract === null || newContract === void 0 ? void 0 : newContract._id, docType: "contracts" }), "", "internalSignature");
    }
    let updated = yield (0, contracts_2.updateContract)(id, newContract);
    if (updated) {
        logger_1.logger.log(logOptions);
    }
    res.status(200).send(updated);
}));
