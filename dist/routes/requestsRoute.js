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
const users_1 = require("../models/users");
const requests_3 = require("../services/requests");
exports.requetsRouter = (0, express_1.Router)();
exports.requetsRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, requests_2.getAllRequests)());
}));
exports.requetsRouter.get("/countsByDep", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.session);
    res.send(yield (0, requests_2.getReqCountsByDepartment)());
}));
exports.requetsRouter.get("/countsByStatus", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, requests_2.getReqCountsByStatus)());
}));
exports.requetsRouter.get("/countsByCat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, requests_2.getReqCountsByCategory)());
}));
exports.requetsRouter.get("/countsByBudgetStatus", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, requests_2.getReqCountsByBudgetStatus)());
}));
exports.requetsRouter.get("/byStatus/:status/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // console.log('Requester',req.session.user)
    let user = yield users_1.UserModel.findById((_b = (_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.user);
    let permissions = user === null || user === void 0 ? void 0 : user.permissions;
    let { status, id } = req.params;
    status === "all"
        ? res.send(yield (0, requests_2.getAllRequestsByCreator)(id, user, permissions))
        : res.send(yield (0, requests_2.getAllRequestsByStatus)(status, id, user, permissions));
}));
exports.requetsRouter.get("/byCreator/:createdBy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { createdBy } = req.params;
    res.send(yield (0, requests_2.getAllRequestsByCreator)(createdBy));
}));
exports.requetsRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    res.send(yield (0, requests_2.getRequestById)(id));
}));
exports.requetsRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { createdBy, items, dueDate, status, attachementUrls, description, serviceCategory, reason, declinedBy, budgeted, budgetLine, title, hod_approvalDate, hof_approvalDate, pm_approvalDate, rejectionDate, level1Approver, sourcingMethod } = req.body;
    let number = yield (0, requests_3.generateReqNumber)();
    let itemObjects = items.map((i) => {
        if (!i.currency)
            i.currency = "RWF";
        return i;
    });
    let requestToCreate = new requests_1.Request(createdBy, itemObjects, dueDate, status, attachementUrls, number, description, serviceCategory, reason, declinedBy, budgeted, budgetLine, title, hod_approvalDate, hof_approvalDate, pm_approvalDate, rejectionDate, level1Approver, sourcingMethod);
    let createdRequest = yield (0, requests_2.saveRequest)(requestToCreate);
    res.status(201).send(createdRequest);
}));
exports.requetsRouter.post("/approve/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    res.send(yield (0, requests_2.approveRequest)(id));
}));
exports.requetsRouter.post("/decline/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let { reason, declinedBy } = req.body;
    res.send(yield (0, requests_2.declineRequest)(id, reason, declinedBy));
}));
exports.requetsRouter.put("/status/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let { status } = req.body;
    res.send(yield (0, requests_2.updateRequestStatus)(id, status));
}));
exports.requetsRouter.put("/sourcingMethod/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let { sourcingMethod } = req.body;
    res.send(yield (0, requests_2.updateRequestSourcingMethod)(id, sourcingMethod));
}));
exports.requetsRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let { updates } = req.body;
    res.send(yield (0, requests_2.updateRequest)(id, updates));
}));
