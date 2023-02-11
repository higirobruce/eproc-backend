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
const express_1 = require("express");
const contracts_1 = require("../classrepo/contracts");
const contracts_2 = require("../controllers/contracts");
const contracts_3 = require("../services/contracts");
exports.contractRouter = (0, express_1.Router)();
exports.contractRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, contracts_2.getAllContracts)());
}));
exports.contractRouter.get('/byTenderId/:tenderId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { tenderId } = req.params;
    res.send(yield (0, contracts_2.getContractByTenderId)(tenderId));
}));
exports.contractRouter.get('/byVendorId/:vendorId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { vendorId } = req.params;
    res.send(yield (0, contracts_2.getContractByVendorId)(vendorId));
}));
exports.contractRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { vendor, tender, createdBy, sections, status, deliveryProgress } = req.body;
    let number = yield (0, contracts_3.generateContractNumber)();
    let tenderToCreate = new contracts_1.Contract(number, vendor, tender, createdBy, sections, status, deliveryProgress);
    let createdTender = yield (0, contracts_2.saveContract)(tenderToCreate);
    res.status(201).send(createdTender);
}));
