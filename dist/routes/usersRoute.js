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
exports.userRouter = void 0;
const express_1 = require("express");
const users_1 = require("../classrepo/users");
const users_2 = require("../controllers/users");
const users_3 = require("../services/users");
const logger_1 = require("../utils/logger");
const sendEmailNode_1 = require("../utils/sendEmailNode");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, users_2.getAllUsers)());
}));
exports.userRouter.get("/vendors", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, users_2.getAllVendors)());
}));
exports.userRouter.get("/vendors/byStatus/:status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { status } = req.params;
    if (status === "all")
        res.send(yield (0, users_2.getAllVendors)());
    else
        res.send(yield (0, users_2.getAllVendorsByStatus)(status));
}));
exports.userRouter.get("/level1Approvers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, users_2.getAllLevel1Approvers)());
}));
exports.userRouter.get("/internal", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, users_2.getAllInternalUsers)());
}));
exports.userRouter.get("/internal/byStatus/:status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { status } = req.params;
    if (status === 'all')
        res.send(yield (0, users_2.getAllInternalUsers)());
    else
        res.send(yield (0, users_2.getAllInternalUsersByStatus)(status));
}));
exports.userRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { userType, email, telephone, experienceDurationInYears, experienceDurationInMonths, webSite, status, password, createdOn, createdBy, rating, tin, companyName, notes, department, contactPersonNames, title, hqAddress, country, passportNid, services, permissions, rdbCertId, vatCertId, firstName, lastName, tempEmail, tempPassword, } = req.body;
    let password_new = userType == "VENDOR" ? password : (0, users_3.generatePassword)(8);
    let number = yield (0, users_3.generateUserNumber)();
    let userToCreate = new users_1.User(userType, email, telephone, experienceDurationInYears, experienceDurationInMonths, webSite, status, (0, users_3.hashPassword)(password_new), createdOn, createdBy, rating, tin, companyName, number, notes, department, contactPersonNames, title, hqAddress, country, passportNid, services, permissions, rdbCertId, vatCertId, firstName, lastName, tempEmail, (0, users_3.hashPassword)(tempPassword));
    let createdUser = yield (0, users_2.saveUser)(userToCreate);
    if (createdUser) {
        logger_1.logger.log({
            level: "info",
            message: `${createdUser === null || createdUser === void 0 ? void 0 : createdUser._id} was successfully created`,
        });
        (0, sendEmailNode_1.send)("", email, "Account created", JSON.stringify({ email, password: password_new }), "", "newUserAccount");
    }
    res.status(201).send(createdUser);
}));
exports.userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    let user = yield (0, users_2.getUserByEmail)(email);
    if (user) {
        logger_1.logger.log({
            level: "info",
            message: `${user === null || user === void 0 ? void 0 : user.email} successfully logged in`,
        });
        res.send({
            allowed: (0, users_3.validPassword)(password, user.password) ||
                (0, users_3.validPassword)(password, user.tempPassword),
            user: user,
        });
    }
    else {
        logger_1.logger.log({
            level: "info",
            message: `${email} failed to log in`,
        });
        res.send({
            allowed: false,
            user: {},
        });
    }
}));
exports.userRouter.post("/approve/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let { approvedBy } = req.body;
    let result = yield (0, users_2.approveUser)(id);
    res.send(result).status(201);
}));
exports.userRouter.post("/decline/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    res.send(yield (0, users_2.declineUser)(id));
}));
exports.userRouter.post("/ban/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    res.send(yield (0, users_2.banUser)(id));
}));
exports.userRouter.post("/activate/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    res.send(yield (0, users_2.activateUser)(id));
}));
exports.userRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let { newUser } = req.body;
    res.send(yield (0, users_2.updateUser)(id, newUser));
}));
exports.userRouter.put("/updatePassword/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let { newPassword, currentPassword } = req.body;
    let updatedUser = yield (0, users_2.updateMyPassword)(id, currentPassword, (0, users_3.hashPassword)(newPassword));
    if (updatedUser) {
        logger_1.logger.log({
            level: "warn",
            message: `Password for ${id} was successfully reset`,
        });
    }
    res.send(updatedUser);
}));
exports.userRouter.put("/reset/:email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email } = req.params;
    let updatedUser = yield (0, users_2.resetPassword)(email);
    if (updatedUser) {
        logger_1.logger.log({
            level: "warn",
            message: `Password for ${updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser._id} was successfully reset`,
        });
    }
    res.send(updatedUser);
}));
