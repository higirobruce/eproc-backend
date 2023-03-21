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
exports.saveBankDetails = exports.setTempFields = exports.updateUser = exports.activateUser = exports.banUser = exports.declineUser = exports.approveUser = exports.getVendorByCompanyName = exports.getUserByEmail = exports.saveUser = exports.getB1SeriesFromNames = exports.createSupplierinB1 = exports.getAllInternalUsers = exports.getVendorById = exports.getAllLevel1Approvers = exports.getAllVendors = exports.getAllUsers = void 0;
const users_1 = require("../models/users");
const sapB1Connection_1 = require("../utils/sapB1Connection");
const series_1 = require("./series");
const node_localstorage_1 = require("node-localstorage");
let localstorage = new node_localstorage_1.LocalStorage("./scratch");
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let users = yield users_1.UserModel.find().populate("department");
            return users;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`,
            };
        }
    });
}
exports.getAllUsers = getAllUsers;
function getAllVendors() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let users = yield users_1.UserModel.find({ userType: "VENDOR" })
                .populate("department")
                .sort({ createdOn: "desc" });
            return users;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`,
            };
        }
    });
}
exports.getAllVendors = getAllVendors;
function getAllLevel1Approvers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let users = yield users_1.UserModel.find({
                "permissions.canApproveAsHod": true,
            }, {
                firstName: 1,
                lastName: 1,
            }).populate("department");
            return users;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`,
            };
        }
    });
}
exports.getAllLevel1Approvers = getAllLevel1Approvers;
function getVendorById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let users = yield users_1.UserModel.findOne({
                userType: "VENDOR",
                _id: id,
            }).populate("department");
            return users;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`,
            };
        }
    });
}
exports.getVendorById = getVendorById;
function getAllInternalUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let users = yield users_1.UserModel.find({ userType: { $ne: "VENDOR" } }).populate("department");
            return users;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`,
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
            Series,
        };
        return (0, sapB1Connection_1.sapLogin)().then((res) => __awaiter(this, void 0, void 0, function* () {
            let COOKIE = res.headers.get("set-cookie");
            localstorage.setItem("cookie", `${COOKIE}`);
            return fetch("https://192.168.20.181:50000/b1s/v1/BusinessPartners", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `${localstorage.getItem("cookie")}`,
                },
                body: JSON.stringify(options),
            })
                .then((res) => res.json())
                .then((res) => __awaiter(this, void 0, void 0, function* () {
                if ((res === null || res === void 0 ? void 0 : res.error) && (res === null || res === void 0 ? void 0 : res.error.code) == 301) {
                    console.log("Tried many times, we cant login");
                    return false;
                }
                else {
                    return true;
                }
            }))
                .catch((err) => {
                return false;
            });
        }));
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
            let createdUser = yield users_1.UserModel.create(user);
            return createdUser._id;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`,
            };
        }
    });
}
exports.saveUser = saveUser;
function getUserByEmail(userEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield users_1.UserModel.findOne({ $or: [{ email: userEmail }, { tempEmail: userEmail }] }).populate("department");
        return user;
    });
}
exports.getUserByEmail = getUserByEmail;
function getVendorByCompanyName(name) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield users_1.UserModel.findOne({ companyName: name });
        return user;
    });
}
exports.getVendorByCompanyName = getVendorByCompanyName;
function approveUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = yield users_1.UserModel.findById(id).populate("department");
            let name = user === null || user === void 0 ? void 0 : user.companyName;
            if ((user === null || user === void 0 ? void 0 : user.userType) === "VENDOR") {
                let series = yield getB1SeriesFromNames(name);
                let createdCode = yield createSupplierinB1(name, "cSupplier", series);
                if (createdCode) {
                    user = yield users_1.UserModel.findByIdAndUpdate(id, {
                        $set: { status: "approved" },
                    }, { $new: true }).populate("department");
                    return user;
                }
                return {
                    status: createdCode ? "approved" : "created",
                    error: !createdCode,
                    message: createdCode ? "" : "Could not connect to SAP B1.",
                };
            }
            else {
                user = yield users_1.UserModel.findByIdAndUpdate(id, {
                    $set: { status: "approved" },
                }).populate("department");
                return user;
            }
        }
        catch (err) {
            return {
                status: "created",
                error: true,
                message: "Could not connect to SAP B1.",
            };
        }
    });
}
exports.approveUser = approveUser;
function declineUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = yield users_1.UserModel.findByIdAndUpdate(id, { $set: { status: "declined" } }, { new: true });
            return user;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`,
            };
        }
    });
}
exports.declineUser = declineUser;
function banUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = yield users_1.UserModel.findByIdAndUpdate(id, { $set: { status: "banned" } }, { new: true });
            return user;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`,
            };
        }
    });
}
exports.banUser = banUser;
function activateUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = yield users_1.UserModel.findByIdAndUpdate(id, { $set: { status: "approved" } }, { new: true });
            return user;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`,
            };
        }
    });
}
exports.activateUser = activateUser;
function updateUser(id, newUser) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = yield users_1.UserModel.findByIdAndUpdate(id, newUser, { new: true });
            return user;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`,
            };
        }
    });
}
exports.updateUser = updateUser;
function setTempFields(id, tempEmail, tempPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(id, tempEmail, tempPassword);
        try {
            let user = yield users_1.UserModel.findByIdAndUpdate(id, { $set: { tempEmail: tempEmail, tempPassword: tempPassword } }, { new: true });
            return user;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`,
            };
        }
    });
}
exports.setTempFields = setTempFields;
function saveBankDetails(id, bankName, bankAccountNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = yield users_1.UserModel.findByIdAndUpdate(id, { $set: { bankName, bankAccountNumber } }, { new: true });
            return user;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`,
            };
        }
    });
}
exports.saveBankDetails = saveBankDetails;
