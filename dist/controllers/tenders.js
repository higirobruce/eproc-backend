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
exports.getTendCountsByCategory = exports.getTendCountsByDepartment = exports.updateTender = exports.updateTenderStatus = exports.saveTender = exports.getClosedTenders = exports.getOpenTenders = exports.getTendersByServiceCategoryList = exports.getTendersByRequest = exports.getTendersById = exports.getAllTendersByStatus = exports.getAllTenders = void 0;
const tenders_1 = require("../models/tenders");
const users_1 = require("../models/users");
const sendEmailNode_1 = require("../utils/sendEmailNode");
function getAllTenders() {
    return __awaiter(this, void 0, void 0, function* () {
        let reqs = yield tenders_1.TenderModel.find()
            .populate("createdBy")
            .populate({
            path: "createdBy",
            populate: {
                path: "department",
                model: "Department",
            },
        })
            .populate("purchaseRequest");
        return reqs;
    });
}
exports.getAllTenders = getAllTenders;
function getAllTendersByStatus(status) {
    return __awaiter(this, void 0, void 0, function* () {
        let _status = status == "open"
            ? { submissionDeadLine: { $gt: Date.now() } }
            : { submissionDeadLine: { $lt: Date.now() } };
        let reqs = yield tenders_1.TenderModel.find(_status)
            .populate("createdBy")
            .populate({
            path: "createdBy",
            populate: {
                path: "department",
                model: "Department",
            },
        })
            .populate("purchaseRequest");
        return reqs;
    });
}
exports.getAllTendersByStatus = getAllTendersByStatus;
function getTendersById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let req = yield tenders_1.TenderModel.findById({ id })
            .populate("createdBy")
            .populate({
            path: "createdBy",
            populate: {
                path: "department",
                model: "Department",
            },
        })
            .populate("purchaseRequest");
        return req;
    });
}
exports.getTendersById = getTendersById;
function getTendersByRequest(requestId) {
    return __awaiter(this, void 0, void 0, function* () {
        let reqs = yield tenders_1.TenderModel.find({ purchaseRequest: requestId })
            .populate("createdBy")
            .populate({
            path: "createdBy",
            populate: {
                path: "department",
                model: "Department",
            },
        })
            .populate("purchaseRequest");
        return reqs;
    });
}
exports.getTendersByRequest = getTendersByRequest;
function getTendersByServiceCategoryList(serviceCategories) {
    return __awaiter(this, void 0, void 0, function* () {
        let pipeline = [
            {
                $lookup: {
                    from: "requests",
                    localField: "purchaseRequest",
                    foreignField: "_id",
                    as: "purchaseRequest",
                },
            },
            {
                $unwind: {
                    path: "$purchaseRequest",
                    preserveNullAndEmptyArrays: true,
                },
            },
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
                    preserveNullAndEmptyArrays: false,
                },
            },
            {
                $lookup: {
                    from: "departments",
                    localField: "createdBy.department",
                    foreignField: "_id",
                    as: "createdBy.department",
                },
            },
            {
                $unwind: {
                    path: "$createdBy.department",
                    preserveNullAndEmptyArrays: false,
                },
            },
            {
                $match: {
                    "purchaseRequest.serviceCategory": {
                        $in: serviceCategories,
                    },
                },
            },
        ];
        // let reqs = await TenderModel.find({ purchaseRequest: requestId }).populate('createdBy').populate({
        //     path: "createdBy",
        //     populate: {
        //         path: 'department',
        //         model: 'Department'
        //     }
        // }).populate('purchaseRequest')
        let reqs = yield tenders_1.TenderModel.aggregate(pipeline);
        return reqs;
    });
}
exports.getTendersByServiceCategoryList = getTendersByServiceCategoryList;
function getOpenTenders() {
    return __awaiter(this, void 0, void 0, function* () {
        let reqs = yield tenders_1.TenderModel.find({ status: "open" })
            .populate("createdBy")
            .populate({
            path: "createdBy",
            populate: {
                path: "department",
                model: "Department",
            },
        })
            .populate("purchaseRequest");
        return reqs;
    });
}
exports.getOpenTenders = getOpenTenders;
function getClosedTenders() {
    return __awaiter(this, void 0, void 0, function* () {
        let reqs = yield tenders_1.TenderModel.find({
            $or: [{ status: "closed" }, { status: { $ne: "open" } }],
        })
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
exports.getClosedTenders = getClosedTenders;
function saveTender(tender) {
    return __awaiter(this, void 0, void 0, function* () {
        let newTender = yield tenders_1.TenderModel.create(tender);
        //Send notifications to vendors in the tender's caterogry
        let vendors = yield users_1.UserModel.find({
            services: { $elemMatch: { $eq: "CLEANING SERVICES" } },
        });
        let vendorEmails = vendors === null || vendors === void 0 ? void 0 : vendors.map((v) => {
            return v === null || v === void 0 ? void 0 : v.email;
        });
        if ((vendorEmails === null || vendorEmails === void 0 ? void 0 : vendorEmails.length) >= 1) {
            (0, sendEmailNode_1.send)("", vendorEmails, "New Tender Notice", "", "", "newTender");
        }
        return newTender;
    });
}
exports.saveTender = saveTender;
function updateTenderStatus(id, newStatus) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield tenders_1.TenderModel.findByIdAndUpdate(id, { $set: { status: newStatus } });
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
exports.updateTenderStatus = updateTenderStatus;
function updateTender(id, newTender) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let updatedTender = yield tenders_1.TenderModel.findOneAndUpdate({ _id: id }, newTender, { new: true })
                .populate("createdBy")
                .populate({
                path: "createdBy",
                populate: {
                    path: "department",
                    model: "Department",
                },
            })
                .populate("purchaseRequest");
            return updatedTender;
        }
        catch (err) {
            // return {
            //   error: true,
            //   errorMessage: `Error :${err}`,
            // };
        }
    });
}
exports.updateTender = updateTender;
function getTendCountsByDepartment() {
    return __awaiter(this, void 0, void 0, function* () {
        let lookup = [
            {
                $lookup: {
                    from: "requests",
                    localField: "purchaseRequest",
                    foreignField: "_id",
                    as: "purchaseRequest",
                },
            },
            {
                $unwind: {
                    path: "$purchaseRequest",
                    includeArrayIndex: "string",
                    preserveNullAndEmptyArrays: false,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "purchaseRequest.createdBy",
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
        let result = yield tenders_1.TenderModel.aggregate(lookup);
        return result;
    });
}
exports.getTendCountsByDepartment = getTendCountsByDepartment;
function getTendCountsByCategory() {
    return __awaiter(this, void 0, void 0, function* () {
        let lookup = [
            {
                $lookup: {
                    from: "requests",
                    localField: "purchaseRequest",
                    foreignField: "_id",
                    as: "purchaseRequest",
                },
            },
            {
                $unwind: {
                    path: "$purchaseRequest",
                    includeArrayIndex: "string",
                    preserveNullAndEmptyArrays: false,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "purchaseRequest.createdBy",
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
                    _id: "$purchaseRequest.serviceCategory",
                    totalCount: {
                        $count: {},
                    },
                },
            },
        ];
        let result = yield tenders_1.TenderModel.aggregate(lookup);
        return result;
    });
}
exports.getTendCountsByCategory = getTendCountsByCategory;
