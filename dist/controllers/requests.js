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
exports.declineRequest = exports.approveRequest = exports.saveRequest = exports.getAllRequests = void 0;
const requests_1 = require("../models/requests");
function getAllRequests() {
    return __awaiter(this, void 0, void 0, function* () {
        let reqs = yield requests_1.RequestModel.find().populate('createdBy').populate({
            path: "createdBy",
            populate: {
                path: 'department',
                model: 'Department'
            }
        });
        return reqs;
    });
}
exports.getAllRequests = getAllRequests;
function saveRequest(request) {
    return __awaiter(this, void 0, void 0, function* () {
        let newReq = yield requests_1.RequestModel.create(request);
        return newReq._id;
    });
}
exports.saveRequest = saveRequest;
function approveRequest(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield requests_1.RequestModel.findByIdAndUpdate(id, { $set: { status: "approved" } });
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
exports.approveRequest = approveRequest;
function declineRequest(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield requests_1.RequestModel.findByIdAndUpdate(id, { $set: { status: "declined" } });
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
exports.declineRequest = declineRequest;
