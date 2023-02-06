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
exports.getTendCountsByCategory = exports.getTendCountsByDepartment = exports.updateTenderStatus = exports.saveTender = exports.getClosedTenders = exports.getOpenTenders = exports.getTendersByRequest = exports.getAllTenders = void 0;
const tenders_1 = require("../models/tenders");
function getAllTenders() {
    return __awaiter(this, void 0, void 0, function* () {
        let reqs = yield tenders_1.TenderModel.find().populate('createdBy').populate({
            path: "createdBy",
            populate: {
                path: 'department',
                model: 'Department'
            }
        }).populate('purchaseRequest');
        return reqs;
    });
}
exports.getAllTenders = getAllTenders;
function getTendersByRequest(requestId) {
    return __awaiter(this, void 0, void 0, function* () {
        let reqs = yield tenders_1.TenderModel.find({ purchaseRequest: requestId }).populate('createdBy').populate({
            path: "createdBy",
            populate: {
                path: 'department',
                model: 'Department'
            }
        }).populate('purchaseRequest');
        return reqs;
    });
}
exports.getTendersByRequest = getTendersByRequest;
function getOpenTenders() {
    return __awaiter(this, void 0, void 0, function* () {
        let reqs = yield tenders_1.TenderModel.find({ status: 'open' }).populate('createdBy').populate({
            path: "createdBy",
            populate: {
                path: 'department',
                model: 'Department'
            }
        }).populate('purchaseRequest');
        return reqs;
    });
}
exports.getOpenTenders = getOpenTenders;
function getClosedTenders() {
    return __awaiter(this, void 0, void 0, function* () {
        let reqs = yield tenders_1.TenderModel.find({ status: 'closed' }).populate('createdBy').populate({
            path: "createdBy",
            populate: {
                path: 'department',
                model: 'Department'
            }
        });
        return reqs;
    });
}
exports.getClosedTenders = getClosedTenders;
function saveTender(tender) {
    return __awaiter(this, void 0, void 0, function* () {
        let newTender = yield tenders_1.TenderModel.create(tender);
        return newTender._id;
    });
}
exports.saveTender = saveTender;
function updateTenderStatus(id, newStatus) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield tenders_1.TenderModel.findByIdAndUpdate(id, { $set: { status: newStatus } });
            return { message: 'done' };
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`
            };
        }
    });
}
exports.updateTenderStatus = updateTenderStatus;
function getTendCountsByDepartment() {
    return __awaiter(this, void 0, void 0, function* () {
        let lookup = [
            {
                '$lookup': {
                    'from': 'requests',
                    'localField': 'purchaseRequest',
                    'foreignField': '_id',
                    'as': 'purchaseRequest'
                }
            }, {
                '$unwind': {
                    'path': '$purchaseRequest',
                    'includeArrayIndex': 'string',
                    'preserveNullAndEmptyArrays': false
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'purchaseRequest.createdBy',
                    'foreignField': '_id',
                    'as': 'createdBy'
                }
            }, {
                '$unwind': {
                    'path': '$createdBy',
                    'includeArrayIndex': 'string',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$lookup': {
                    'from': 'departments',
                    'localField': 'createdBy.department',
                    'foreignField': '_id',
                    'as': 'department'
                }
            }, {
                '$unwind': {
                    'path': '$department',
                    'includeArrayIndex': 'string',
                    'preserveNullAndEmptyArrays': false
                }
            }, {
                '$group': {
                    '_id': '$department.description',
                    'totalCount': {
                        '$count': {}
                    }
                }
            }
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
                '$lookup': {
                    'from': 'requests',
                    'localField': 'purchaseRequest',
                    'foreignField': '_id',
                    'as': 'purchaseRequest'
                }
            }, {
                '$unwind': {
                    'path': '$purchaseRequest',
                    'includeArrayIndex': 'string',
                    'preserveNullAndEmptyArrays': false
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'purchaseRequest.createdBy',
                    'foreignField': '_id',
                    'as': 'createdBy'
                }
            }, {
                '$unwind': {
                    'path': '$createdBy',
                    'includeArrayIndex': 'string',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$lookup': {
                    'from': 'departments',
                    'localField': 'createdBy.department',
                    'foreignField': '_id',
                    'as': 'department'
                }
            }, {
                '$unwind': {
                    'path': '$department',
                    'includeArrayIndex': 'string',
                    'preserveNullAndEmptyArrays': false
                }
            }, {
                '$group': {
                    '_id': '$purchaseRequest.serviceCategory',
                    'totalCount': {
                        '$count': {}
                    }
                }
            }
        ];
        let result = yield tenders_1.TenderModel.aggregate(lookup);
        return result;
    });
}
exports.getTendCountsByCategory = getTendCountsByCategory;
