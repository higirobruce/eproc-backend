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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReqCountsByStatus = exports.updateRequest = exports.updateRequestSourcingMethod = exports.updateRequestStatus = exports.declineRequest = exports.approveRequest = exports.getAllRequestsByStatus = exports.getAllRequestsByCreator = exports.getPaymentRequestById = exports.savePaymentRequest = exports.getAllPaymentRequests = void 0;
const moment_1 = __importDefault(require("moment"));
const paymentRequests_1 = require("../models/paymentRequests");
const users_1 = require("../models/users");
function getAllPaymentRequests() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let paymentRequests = yield paymentRequests_1.PaymentRequestModel.find().populate("createdBy purchaseOrder").populate({
                path: "purchaseOrder",
                populate: {
                    path: "tender",
                    model: "Tender",
                },
            }).populate({
                path: "purchaseOrder.tender",
                populate: {
                    path: "purchaseRequest",
                    model: "Request",
                },
            }).populate('approver').populate('reviewedBy');
            return paymentRequests;
        }
        catch (err) {
            throw err;
        }
    });
}
exports.getAllPaymentRequests = getAllPaymentRequests;
function savePaymentRequest(paymentRequest) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let createdPaymentRequest = yield paymentRequests_1.PaymentRequestModel.create(paymentRequest);
            return createdPaymentRequest.populate("purchaseOrder createdBy approver reviewedBy");
        }
        catch (err) {
            throw err;
        }
    });
}
exports.savePaymentRequest = savePaymentRequest;
function getPaymentRequestById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let reqs = yield paymentRequests_1.PaymentRequestModel.findById(id)
            .populate("createdBy")
            .populate("purchaseOrder")
            .populate('approver')
            .populate('reviewedBy');
        return reqs;
    });
}
exports.getPaymentRequestById = getPaymentRequestById;
function getAllRequestsByCreator(createdBy) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = {};
        if (createdBy && createdBy !== "null")
            query = { createdBy, status: { $ne: "withdrawn" } };
        let reqs = yield paymentRequests_1.PaymentRequestModel.find(query).populate("createdBy purchaseOrder approver reviewedBy");
        return reqs;
    });
}
exports.getAllRequestsByCreator = getAllRequestsByCreator;
function getAllRequestsByStatus(status, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = status === "pending"
            ? {
                status: {
                    $in: ["pending-approval"],
                },
            }
            : { status };
        if (id && id !== "null")
            query = Object.assign(Object.assign({}, query), { createdBy: id });
        let reqs = yield paymentRequests_1.PaymentRequestModel.find(query).populate("createdBy purchaseOrder approver reviewedBy");
        return reqs;
    });
}
exports.getAllRequestsByStatus = getAllRequestsByStatus;
function approveRequest(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield paymentRequests_1.PaymentRequestModel.findByIdAndUpdate(id, {
                $set: { status: "approved" },
            });
            return { message: "done" };
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`,
            };
        }
    });
}
exports.approveRequest = approveRequest;
function declineRequest(id, reason, declinedBy) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let response = yield paymentRequests_1.PaymentRequestModel.findByIdAndUpdate(id, {
                $set: {
                    status: "declined",
                    reasonForRejection: reason,
                    declinedBy: declinedBy,
                    rejectionDate: (0, moment_1.default)(),
                },
            }, { new: true }).populate("createdBy purchaseOrder approver");
            //Sending email notification
            let requestor = yield users_1.UserModel.findById(response === null || response === void 0 ? void 0 : response.createdBy);
            return response;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`,
            };
        }
    });
}
exports.declineRequest = declineRequest;
function updateRequestStatus(id, newStatus) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let update = {};
            if (newStatus === "approved (hod)")
                update = { status: newStatus, hod_approvalDate: Date.now() };
            else if (newStatus === "approved (fd)")
                update = { status: newStatus, hof_approvalDate: Date.now() };
            else if (newStatus === "approved (pm)")
                update = { status: newStatus, pm_approvalDate: Date.now() };
            else
                update = { status: newStatus };
            let newRequest = yield paymentRequests_1.PaymentRequestModel.findByIdAndUpdate(id, { $set: update }, { new: true });
            //Sending email notifications
            if (newStatus === "approved (hod)") {
                let level2Approvers = yield users_1.UserModel.find({
                    "permissions.canApproveAsHof": true,
                });
                let approversEmails = level2Approvers === null || level2Approvers === void 0 ? void 0 : level2Approvers.map((l2) => {
                    return l2 === null || l2 === void 0 ? void 0 : l2.email;
                });
            }
            if (newStatus === "approved (fd)") {
                let level3Approvers = yield users_1.UserModel.find({
                    "permissions.canApproveAsPM": true,
                });
                let approversEmails = level3Approvers === null || level3Approvers === void 0 ? void 0 : level3Approvers.map((l3) => {
                    return l3 === null || l3 === void 0 ? void 0 : l3.email;
                });
            }
            return paymentRequests_1.PaymentRequestModel.populate(newRequest, "createdBy level1Approver budgetLine");
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`,
            };
        }
    });
}
exports.updateRequestStatus = updateRequestStatus;
function updateRequestSourcingMethod(id, sourcingMethod) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let update = { sourcingMethod: sourcingMethod };
            let newRequest = yield paymentRequests_1.PaymentRequestModel.findByIdAndUpdate(id, { $set: update }, { new: true })
                .populate("createdBy")
                .populate("level1Approver")
                .populate({
                path: "createdBy",
                populate: {
                    path: "department",
                    model: "Department",
                },
            })
                .populate("budgetLine");
            return newRequest;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`,
            };
        }
    });
}
exports.updateRequestSourcingMethod = updateRequestSourcingMethod;
function updateRequest(id, update) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let newRequest = yield paymentRequests_1.PaymentRequestModel.findByIdAndUpdate(id, update, {
                new: true,
            });
            return newRequest;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`,
            };
        }
    });
}
exports.updateRequest = updateRequest;
function getReqCountsByStatus() {
    return __awaiter(this, void 0, void 0, function* () {
        let lookup = [
            {
                $group: {
                    _id: "$status",
                    count: {
                        $count: {},
                    },
                },
            },
        ];
        let result = yield paymentRequests_1.PaymentRequestModel.aggregate(lookup);
        return result.sort((a, b) => (a._id < b._id ? -1 : 1));
    });
}
exports.getReqCountsByStatus = getReqCountsByStatus;
