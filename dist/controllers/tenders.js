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
exports.updateTenderStatus = exports.saveTender = exports.getClosedTenders = exports.getOpenTenders = exports.getAllTenders = void 0;
const tenders_1 = require("../models/tenders");
function getAllTenders() {
    return __awaiter(this, void 0, void 0, function* () {
        let reqs = yield tenders_1.TenderModel.find().populate('createdBy').populate({
            path: "createdBy",
            populate: {
                path: 'department',
                model: 'Department'
            }
        });
        return reqs;
    });
}
exports.getAllTenders = getAllTenders;
function getOpenTenders() {
    return __awaiter(this, void 0, void 0, function* () {
        let reqs = yield tenders_1.TenderModel.find({ status: 'open' }).populate('createdBy').populate({
            path: "createdBy",
            populate: {
                path: 'department',
                model: 'Department'
            }
        });
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
