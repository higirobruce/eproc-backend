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
exports.userRouter = (0, express_1.Router)();
exports.userRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, users_2.getAllUsers)());
}));
exports.userRouter.get("/vendors", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, users_2.getAllVendors)());
}));
exports.userRouter.get("/level1Approvers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, users_2.getAllLevel1Approvers)());
}));
exports.userRouter.get("/internal", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, users_2.getAllInternalUsers)());
}));
exports.userRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { userType, email, telephone, experienceDurationInYears, experienceDurationInMonths, webSite, status, password, createdOn, createdBy, rating, tin, companyName, notes, department, contactPersonNames, title, hqAddress, country, passportNid, services, permissions, rdbCertId, vatCertId, bankName, bankAccountNumber } = req.body;
    let number = yield (0, users_3.generateUserNumber)();
    let userToCreate = new users_1.User(userType, email, telephone, experienceDurationInYears, experienceDurationInMonths, webSite, status, (0, users_3.hashPassword)(password), createdOn, createdBy, rating, tin, companyName, number, notes, department, contactPersonNames, title, hqAddress, country, passportNid, services, permissions, rdbCertId, vatCertId, bankName, bankAccountNumber);
    let createdUser = yield (0, users_2.saveUser)(userToCreate);
    res.status(201).send(createdUser);
}));
exports.userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    let user = yield (0, users_2.getUserByEmail)(email);
    if (user) {
        res.send({
            allowed: (0, users_3.validPassword)(password, user.password),
            user: user,
        });
    }
    else {
        res.send({
            allowed: false,
            user: {},
        });
    }
}));
exports.userRouter.post("/approve/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    res.send(yield (0, users_2.approveUser)(id));
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
exports.userRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let { newUser } = req.body;
    res.send(yield (0, users_2.updateUser)(id, newUser));
}));
