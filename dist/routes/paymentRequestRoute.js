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
const users_1 = require("../models/users");
const paymentRequests_2 = require("../services/paymentRequests");
const sendEmailNode_1 = require("../utils/sendEmailNode");
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
exports.paymentRequestRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let { updates } = req.body;
    let updatedRequest = yield (0, paymentRequests_1.updateRequest)(id, updates);
    if (updates.notifyApprover && updates.approver) {
        //send notification
        let approver = yield users_1.UserModel.findById(updates.approver);
        (0, sendEmailNode_1.send)('from', approver === null || approver === void 0 ? void 0 : approver.email, "Your Approval is needed", JSON.stringify(updatedRequest), 'html', 'payment-request-approval');
    }
    res.send(updatedRequest);
}));
