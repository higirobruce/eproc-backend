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
exports.getReqCountsByCategory = exports.getReqCountsByDepartment = exports.updateRequest = exports.updateRequestStatus = exports.declineRequest = exports.approveRequest = exports.saveRequest = exports.getAllRequestsByCreator = exports.getAllRequests = void 0;
const requests_1 = require("../models/requests");
const users_1 = require("../models/users");
const sendEmailNode_1 = require("../utils/sendEmailNode");
function getAllRequests() {
    return __awaiter(this, void 0, void 0, function* () {
        let reqs = yield requests_1.RequestModel.find()
            .populate("createdBy")
            .populate({
            path: "createdBy",
            populate: {
                path: "department",
                model: "Department",
            },
        });
        return reqs;
    });
}
exports.getAllRequests = getAllRequests;
function getAllRequestsByCreator(createdBy) {
    return __awaiter(this, void 0, void 0, function* () {
        let reqs = yield requests_1.RequestModel.find({ createdBy })
            .populate("createdBy")
            .populate({
            path: "createdBy",
            populate: {
                path: "department",
                model: "Department",
            },
        });
        return reqs;
    });
}
exports.getAllRequestsByCreator = getAllRequestsByCreator;
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
                },
            });
            //Sending email notification
            let requestor = yield users_1.UserModel.findById(response === null || response === void 0 ? void 0 : response.createdBy);
            (0, sendEmailNode_1.send)("", requestor === null || requestor === void 0 ? void 0 : requestor.email, "Your Purchase request was rejected", "", "", "rejection");
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
            yield requests_1.RequestModel.findByIdAndUpdate(id, { $set: update });
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
            if (newStatus === 'approved (fd)') {
                let level3Approvers = yield users_1.UserModel.find({
                    "permissions.canApproveAsPM": true,
                });
                let approversEmails = level3Approvers === null || level3Approvers === void 0 ? void 0 : level3Approvers.map((l3) => {
                    return l3 === null || l3 === void 0 ? void 0 : l3.email;
                });
                (0, sendEmailNode_1.send)("", approversEmails, "Purchase request approval", "", "", "approval");
            }
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
exports.updateRequestStatus = updateRequestStatus;
function updateRequest(id, update) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield requests_1.RequestModel.findByIdAndUpdate(id, update);
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
