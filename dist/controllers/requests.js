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
exports.getReqCountsByCategory = exports.getReqCountsByBudgetStatus = exports.getReqCountsByStatus = exports.getReqCountsByDepartment = exports.updateRequest = exports.updateRequestSourcingMethod = exports.updateRequestStatus = exports.declineRequest = exports.approveRequest = exports.saveRequest = exports.getAllRequestsByStatus = exports.getAllRequestsByCreator = exports.getRequestById = exports.getAllRequests = void 0;
const moment_1 = __importDefault(require("moment"));
const requests_1 = require("../models/requests");
const users_1 = require("../models/users");
const sendEmailNode_1 = require("../utils/sendEmailNode");
function getAllRequests() {
    return __awaiter(this, void 0, void 0, function* () {
        let reqs = yield requests_1.RequestModel.find({ status: { $ne: "withdrawn" } })
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
        return reqs;
    });
}
exports.getAllRequests = getAllRequests;
function getRequestById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let reqs = yield requests_1.RequestModel.findById(id)
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
        return reqs;
    });
}
exports.getRequestById = getRequestById;
function getAllRequestsByCreator(createdBy) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = {};
        if (createdBy && createdBy !== "null")
            query = { createdBy, status: { $ne: "withdrawn" } };
        let reqs = yield requests_1.RequestModel.find(query)
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
        return reqs;
    });
}
exports.getAllRequestsByCreator = getAllRequestsByCreator;
function getAllRequestsByStatus(status, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = status === "pending"
            ? {
                status: {
                    $in: [
                        "pending",
                        "approved (hod)",
                        "approved (fd)",
                        "approved (pm)",
                    ],
                },
            }
            : { status };
        if (id && id !== "null")
            query = Object.assign(Object.assign({}, query), { createdBy: id });
        let reqs = yield requests_1.RequestModel.find(query)
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
        return reqs;
    });
}
exports.getAllRequestsByStatus = getAllRequestsByStatus;
function saveRequest(request) {
    return __awaiter(this, void 0, void 0, function* () {
        let newReq = yield requests_1.RequestModel.create(request);
        //Sending Email notification
        let approver = yield users_1.UserModel.findById(request.level1Approver);
        (0, sendEmailNode_1.send)("", approver === null || approver === void 0 ? void 0 : approver.email, "Purchase request approval", "", "", "approval");
        return newReq;
    });
}
exports.saveRequest = saveRequest;
function approveRequest(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield requests_1.RequestModel.findByIdAndUpdate(id, { $set: { status: "approved" } });
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
            let response = yield requests_1.RequestModel.findByIdAndUpdate(id, {
                $set: {
                    status: "declined",
                    reasonForRejection: reason,
                    declinedBy: declinedBy,
                    rejectionDate: (0, moment_1.default)(),
                },
            }, { new: true })
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
            //Sending email notification
            let requestor = yield users_1.UserModel.findById(response === null || response === void 0 ? void 0 : response.createdBy);
            if (requestor === null || requestor === void 0 ? void 0 : requestor.email) {
                (0, sendEmailNode_1.send)("", requestor === null || requestor === void 0 ? void 0 : requestor.email, "Your Purchase request was rejected", "", "", "rejection");
            }
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
            let newRequest = yield requests_1.RequestModel.findByIdAndUpdate(id, { $set: update }, { new: true });
            //Sending email notifications
            if (newStatus === "approved (hod)") {
                let level2Approvers = yield users_1.UserModel.find({
                    "permissions.canApproveAsHof": true,
                });
                let approversEmails = level2Approvers === null || level2Approvers === void 0 ? void 0 : level2Approvers.map((l2) => {
                    return l2 === null || l2 === void 0 ? void 0 : l2.email;
                });
                (0, sendEmailNode_1.send)("", approversEmails, "Purchase request approval", "", "", "approval");
            }
            if (newStatus === "approved (fd)") {
                let level3Approvers = yield users_1.UserModel.find({
                    "permissions.canApproveAsPM": true,
                });
                let approversEmails = level3Approvers === null || level3Approvers === void 0 ? void 0 : level3Approvers.map((l3) => {
                    return l3 === null || l3 === void 0 ? void 0 : l3.email;
                });
                (0, sendEmailNode_1.send)("", approversEmails, "Purchase request approval", "", "", "approval");
            }
            return requests_1.RequestModel.populate(newRequest, "createdBy level1Approver budgetLine");
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
            let newRequest = yield requests_1.RequestModel.findByIdAndUpdate(id, { $set: update }, { new: true })
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
            let newRequest = yield requests_1.RequestModel.findByIdAndUpdate(id, update, {
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
function getReqCountsByDepartment() {
    return __awaiter(this, void 0, void 0, function* () {
        let lookup = [
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "createdBy",
                },
            },
            {
                $unwind: {
                    path: "$createdBy",
                    includeArrayIndex: "string",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "departments",
                    localField: "createdBy.department",
                    foreignField: "_id",
                    as: "department",
                },
            },
            {
                $unwind: {
                    path: "$department",
                    includeArrayIndex: "string",
                    preserveNullAndEmptyArrays: false,
                },
            },
            {
                $group: {
                    _id: "$department.description",
                    totalCount: {
                        $count: {},
                    },
                },
            },
        ];
        let result = yield requests_1.RequestModel.aggregate(lookup);
        return result;
    });
}
exports.getReqCountsByDepartment = getReqCountsByDepartment;
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
        let result = yield requests_1.RequestModel.aggregate(lookup);
        return result;
    });
}
exports.getReqCountsByStatus = getReqCountsByStatus;
function getReqCountsByBudgetStatus() {
    return __awaiter(this, void 0, void 0, function* () {
        let lookup = [
            {
                $group: {
                    _id: "$budgeted",
                    count: {
                        $count: {},
                    },
                },
            },
        ];
        let result = yield requests_1.RequestModel.aggregate(lookup);
        return result;
    });
}
exports.getReqCountsByBudgetStatus = getReqCountsByBudgetStatus;
function getReqCountsByCategory() {
    return __awaiter(this, void 0, void 0, function* () {
        let lookup = [
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "createdBy",
                },
            },
            {
                $unwind: {
                    path: "$createdBy",
                    includeArrayIndex: "string",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: "$serviceCategory",
                    totalCount: {
                        $count: {},
                    },
                },
            },
        ];
        let result = yield requests_1.RequestModel.aggregate(lookup);
        return result;
    });
}
exports.getReqCountsByCategory = getReqCountsByCategory;
