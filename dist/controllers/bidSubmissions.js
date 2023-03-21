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
exports.updateSubmissionStatus = exports.rejectSubmission = exports.rejectOtherSubmissions = exports.deselectOtherSubmissions = exports.awardSubmission = exports.selectSubmission = exports.saveBidSubmission = exports.iSubmittedOnTender = exports.getAverageBidsPerTender = exports.getAllBidSubmissionsByVendor = exports.getAllBidSubmissionsByTender = exports.getAllBidSubmissions = void 0;
const bidSubmissions_1 = require("../models/bidSubmissions");
function getAllBidSubmissions() {
    return __awaiter(this, void 0, void 0, function* () {
        let reqs = yield bidSubmissions_1.BidSubmissionModel.find()
            .populate("createdBy")
            .populate({
            path: "createdBy",
            populate: {
                path: "department",
                model: "Department",
            },
        })
            .populate("tender")
            .populate({
            path: "tender",
            populate: {
                path: "purchaseRequest",
                model: "Request",
            },
        });
        return reqs;
    });
}
exports.getAllBidSubmissions = getAllBidSubmissions;
function getAllBidSubmissionsByTender(tenderId) {
    return __awaiter(this, void 0, void 0, function* () {
        let reqs = yield bidSubmissions_1.BidSubmissionModel.find({ tender: tenderId })
            .populate("createdBy")
            .populate({
            path: "createdBy",
            populate: {
                path: "department",
                model: "Department",
            },
        })
            .populate("tender")
            .populate({
            path: "tender",
            populate: {
                path: "purchaseRequest",
                model: "Request",
            },
        });
        return reqs;
    });
}
exports.getAllBidSubmissionsByTender = getAllBidSubmissionsByTender;
function getAllBidSubmissionsByVendor(vendorId) {
    return __awaiter(this, void 0, void 0, function* () {
        let reqs = yield bidSubmissions_1.BidSubmissionModel.find({ createdBy: vendorId })
            .populate("createdBy")
            .populate({
            path: "createdBy",
            populate: {
                path: "department",
                model: "Department",
            },
        })
            .populate("tender")
            .populate({
            path: "tender",
            populate: {
                path: "purchaseRequest",
                model: "Request",
            },
        });
        return reqs;
    });
}
exports.getAllBidSubmissionsByVendor = getAllBidSubmissionsByVendor;
function getAverageBidsPerTender() {
    return __awaiter(this, void 0, void 0, function* () {
        let pipeline = [
            {
                $lookup: {
                    from: "tenders",
                    localField: "tender",
                    foreignField: "_id",
                    as: "tender",
                },
            },
            {
                $unwind: {
                    path: "$tender",
                    preserveNullAndEmptyArrays: false,
                },
            },
            {
                $group: {
                    _id: "$tender._id",
                    count: {
                        $count: {},
                    },
                },
            },
            {
                $group: {
                    _id: "avg",
                    avg: {
                        $avg: "$count",
                    },
                },
            },
        ];
        let avgs = yield bidSubmissions_1.BidSubmissionModel.aggregate(pipeline);
        return avgs;
    });
}
exports.getAverageBidsPerTender = getAverageBidsPerTender;
function iSubmittedOnTender(tenderId, vendorId) {
    return __awaiter(this, void 0, void 0, function* () {
        let reqs = yield bidSubmissions_1.BidSubmissionModel.find({
            tender: tenderId,
            createdBy: vendorId,
        });
        return reqs.length > 0;
    });
}
exports.iSubmittedOnTender = iSubmittedOnTender;
function saveBidSubmission(submission) {
    return __awaiter(this, void 0, void 0, function* () {
        let newSubmission = yield bidSubmissions_1.BidSubmissionModel.create(submission);
        return newSubmission;
    });
}
exports.saveBidSubmission = saveBidSubmission;
function selectSubmission(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield bidSubmissions_1.BidSubmissionModel.findByIdAndUpdate(id, {
                $set: { status: "selected" },
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
exports.selectSubmission = selectSubmission;
function awardSubmission(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield bidSubmissions_1.BidSubmissionModel.findByIdAndUpdate(id, {
                $set: { status: "awarded" },
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
exports.awardSubmission = awardSubmission;
function deselectOtherSubmissions(tenderId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield bidSubmissions_1.BidSubmissionModel.updateMany({ status: { $ne: "selected" }, tender: tenderId }, { $set: { status: "not selected" } });
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
exports.deselectOtherSubmissions = deselectOtherSubmissions;
function rejectOtherSubmissions(tenderId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield bidSubmissions_1.BidSubmissionModel.updateMany({ status: { $nin: ["selected", "awarded"] }, tender: tenderId }, { $set: { status: "not awarded" } });
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
exports.rejectOtherSubmissions = rejectOtherSubmissions;
function rejectSubmission(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield bidSubmissions_1.BidSubmissionModel.findByIdAndUpdate(id, {
                $set: { status: "rejected" },
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
exports.rejectSubmission = rejectSubmission;
function updateSubmissionStatus(id, newStatus) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield bidSubmissions_1.BidSubmissionModel.findByIdAndUpdate(id, {
                $set: { status: newStatus },
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
exports.updateSubmissionStatus = updateSubmissionStatus;
