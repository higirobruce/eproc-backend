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
exports.submissionsRouter = void 0;
const express_1 = require("express");
const bidSubmissions_1 = require("../controllers/bidSubmissions");
const bidSubmissions_2 = require("../classrepo/bidSubmissions");
const bidSubmissions_3 = require("../services/bidSubmissions");
const tenders_1 = require("../models/tenders");
const sendEmailNode_1 = require("../utils/sendEmailNode");
exports.submissionsRouter = (0, express_1.Router)();
exports.submissionsRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, bidSubmissions_1.getAllBidSubmissions)());
}));
exports.submissionsRouter.get("/byTender/:tenderId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { tenderId } = req.params;
    res.send(yield (0, bidSubmissions_1.getAllBidSubmissionsByTender)(tenderId));
}));
exports.submissionsRouter.get("/byVendor/:vendorId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { vendorId } = req.params;
    res.send(yield (0, bidSubmissions_1.getAllBidSubmissionsByVendor)(vendorId));
}));
exports.submissionsRouter.get("/submitted/:tenderId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { tenderId } = req.params;
    let { vendorId } = req.query;
    res.send(yield (0, bidSubmissions_1.iSubmittedOnTender)(tenderId, vendorId));
}));
exports.submissionsRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { proposalUrls, deliveryDate, price, currency, warranty, discount, status, comment, createdBy, tender, warrantyDuration, bankName, bankAccountNumber, proposalDocId, otherDocId, } = req.body;
    let number = yield (0, bidSubmissions_3.generateBidSubmissionNumber)();
    let submission = new bidSubmissions_2.BidSubmission(proposalUrls, deliveryDate, price, currency, warranty, discount, status, comment, number, createdBy, tender, warrantyDuration, proposalDocId, otherDocId, bankName, bankAccountNumber);
    // await saveBankDetails(createdBy, bankName, bankAccountNumber);
    let createdSubmission = yield (0, bidSubmissions_1.saveBidSubmission)(submission);
    res.status(201).send(createdSubmission);
}));
exports.submissionsRouter.post("/select/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let { tenderId } = req.query;
    let { evaluationReportId } = req.body;
    let tender = yield tenders_1.TenderModel.findByIdAndUpdate(tenderId, {
        $set: { evaluationReportId },
    });
    (0, bidSubmissions_1.selectSubmission)(id).then((r) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, bidSubmissions_1.deselectOtherSubmissions)(tenderId);
        //Send Bid Selection confirmation
        let invitees = tender === null || tender === void 0 ? void 0 : tender.invitees;
        let inviteesEmails = invitees === null || invitees === void 0 ? void 0 : invitees.map((i) => {
            return i === null || i === void 0 ? void 0 : i.approver;
        });
        if (invitees) {
            (0, sendEmailNode_1.send)("", inviteesEmails, "Bid Selection confirmation", JSON.stringify(tender), "", "bidSelectionConfirmation");
        }
        res.send(r);
    }));
}));
exports.submissionsRouter.post("/award/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let { tenderId } = req.query;
    (0, bidSubmissions_1.awardSubmission)(id).then((r) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, bidSubmissions_1.rejectOtherSubmissions)(tenderId);
        res.send(r);
    }));
}));
exports.submissionsRouter.post("/reject/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    res.send(yield (0, bidSubmissions_1.rejectSubmission)(id));
}));
exports.submissionsRouter.put("/status/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let { status } = req.body;
    res.send(yield (0, bidSubmissions_1.updateSubmissionStatus)(id, status));
}));
