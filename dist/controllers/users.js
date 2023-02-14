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
exports.declineUser = exports.approveUser = exports.getUserByEmail = exports.saveUser = exports.getB1SeriesFromNames = exports.createSupplierinB1 = exports.getAllInternalUsers = exports.getAllVendors = exports.getAllUsers = void 0;
const users_1 = require("../models/users");
const series_1 = require("./series");
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
function createSupplierinB1(CardName, CardType, Series) {
    return __awaiter(this, void 0, void 0, function* () {
        let options = {
            // "CardCode": "SA0003",
            CardName,
            CardType,
            Series
        };
        fetch('https://192.168.20.181:50000/b1s/v1/BusinessPartners', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Cookie': 'B1SESSION=12b28ebc-ac5e-11ed-8002-000c29f945cd; ROUTEID=.node2; SESSION=12b28ebc-ac5e-11ed-8002-000c29f945cdß'
            },
            body: JSON.stringify(options)
        }).then(res => res.json())
            .then(res => {
            return res === null || res === void 0 ? void 0 : res.CardCode;
        }).catch(err => {
            console.log(err);
        });
    });
}
exports.createSupplierinB1 = createSupplierinB1;
function getB1SeriesFromNames(entityName) {
    return __awaiter(this, void 0, void 0, function* () {
        let firstChar = entityName.substring(0, 1).toUpperCase();
        // let secondChar = lastName.substring(0,1).toUpperCase();
        let series = yield (0, series_1.getSeriesByDescription)(`S${firstChar}`);
        return series;
    });
}
exports.getB1SeriesFromNames = getB1SeriesFromNames;
function saveUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let name = user.companyName;
            let series = yield getB1SeriesFromNames(name);
            let createdCode = yield createSupplierinB1(name, 'cSupplier', series);
            console.log(createdCode);
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
