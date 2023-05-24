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
exports.paymentRequestRouter = void 0;
const express_1 = require("express");
const paymentRequests_1 = require("../controllers/paymentRequests");
const paymentRequests_2 = require("../services/paymentRequests");
exports.paymentRequestRouter = (0, express_1.Router)();
exports.paymentRequestRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let paymentRequests = yield (0, paymentRequests_1.getAllPaymentRequests)();
        res.status(200).send(paymentRequests);
    }
    catch (err) {
        res.status(500).send({ error: `${err}` });
    }
}));
exports.paymentRequestRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let number = yield (0, paymentRequests_2.generatePaymentRequestNumber)();
    req.body.number = number;
    try {
        let newPaymentRequest = yield (0, paymentRequests_1.savePaymentRequest)(req.body);
        res.status(201).send(newPaymentRequest);
    }
    catch (err) {
        res.status(500).send({ error: `${err}` });
    }
}));
exports.paymentRequestRouter.get("/byStatus/:status/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { status, id } = req.params;
    status === "all"
        ? res.send(yield (0, paymentRequests_1.getAllRequestsByCreator)(id))
        : res.send(yield (0, paymentRequests_1.getAllRequestsByStatus)(status, id));
}));
exports.paymentRequestRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    res.send(yield (0, paymentRequests_1.getPaymentRequestById)(id));
}));
