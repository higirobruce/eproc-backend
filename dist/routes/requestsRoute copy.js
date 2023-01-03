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
exports.requetsRouter = void 0;
const express_1 = require("express");
const requests_1 = require("../classrepo/requests");
const requests_2 = require("../controllers/requests");
const requests_3 = require("../services/requests");
exports.requetsRouter = (0, express_1.Router)();
exports.requetsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, requests_2.getAllRequests)());
}));
exports.requetsRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { createdBy, items, dueDate, status, attachementUrls, } = req.body;
    let number = yield (0, requests_3.generateReqNumber)();
    let itemObjects = items.map((i) => {
        if (!i.currency)
            i.currency = 'RWF';
        return i;
    });
    let requestToCreate = new requests_1.Request(createdBy, itemObjects, dueDate, status, attachementUrls, number);
    let createdRequest = yield (0, requests_2.saveRequest)(requestToCreate);
    res.status(201).send(createdRequest);
}));
exports.requetsRouter.post('/approve/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    res.send(yield (0, requests_2.approveRequest)(id));
}));
exports.requetsRouter.post('/decline/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    res.send(yield (0, requests_2.declineRequest)(id));
}));
exports.requetsRouter.put('/status/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let { status } = req.body;
    res.send(yield (0, requests_2.updateStatus)(id, status));
}));
