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
exports.declineUser = exports.approveUser = exports.getUserByEmail = exports.saveUser = exports.getAllInternalUsers = exports.getAllVendors = exports.getAllUsers = void 0;
const users_1 = require("../models/users");
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let users = yield users_1.UserModel.find().populate('department');
            return users;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`
            };
        }
    });
}
exports.getAllUsers = getAllUsers;
function getAllVendors() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let users = yield users_1.UserModel.find({ userType: "VENDOR" }).populate('department');
            return users;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`
            };
        }
    });
}
exports.getAllVendors = getAllVendors;
function getAllInternalUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let users = yield users_1.UserModel.find({ userType: { $ne: "VENDOR" } }).populate('department');
            return users;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`
            };
        }
    });
}
exports.getAllInternalUsers = getAllInternalUsers;
function saveUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let createdUser = yield users_1.UserModel.create(user);
            return createdUser._id;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`
            };
        }
    });
}
exports.saveUser = saveUser;
function getUserByEmail(userEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield users_1.UserModel.findOne({ email: userEmail });
        return user;
    });
}
exports.getUserByEmail = getUserByEmail;
function approveUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield users_1.UserModel.findByIdAndUpdate(id, { $set: { status: "approved" } }).populate('department');
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
exports.approveUser = approveUser;
function declineUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield users_1.UserModel.findByIdAndUpdate(id, { $set: { status: "declined" } });
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
exports.declineUser = declineUser;
