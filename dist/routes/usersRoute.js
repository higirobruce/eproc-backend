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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationToAllUsers = exports.userRouter = exports.SALT = void 0;
const express_1 = require("express");
const users_1 = require("../classrepo/users");
const purchaseOrders_1 = require("../controllers/purchaseOrders");
const users_2 = require("../controllers/users");
const users_3 = require("../services/users");
const logger_1 = require("../utils/logger");
const sendEmailNode_1 = require("../utils/sendEmailNode");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_4 = require("../models/users");
exports.SALT = process.env.TOKEN_SALT || "968d8b95-72cd-4470-b13e-1017138d32cf";
exports.userRouter = (0, express_1.Router)();
exports.userRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, users_2.getAllUsers)());
}));
exports.userRouter.get("/vendors", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, users_2.getAllVendors)());
}));
exports.userRouter.get("/vendors/rate/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    // console.log(id)
    res.send(yield (0, purchaseOrders_1.getVendorRate)(id));
}));
exports.userRouter.get("/vendors/byId/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    // console.log(id)
    res.send(yield (0, users_2.getVendorById)(id));
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
exports.userRouter.get("/internalUserById/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    res.send(yield (0, users_2.getInternalUserById)(id));
}));
exports.userRouter.get("/internal/byStatus/:status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { status } = req.params;
    if (status === "all")
        res.send(yield (0, users_2.getAllInternalUsers)());
    else
        res.send(yield (0, users_2.getAllInternalUsersByStatus)(status));
}));
exports.userRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { userType, email, telephone, experienceDurationInYears, experienceDurationInMonths, webSite, status, password, createdOn, createdBy, rating, tin, companyName, notes, department, contactPersonNames, title, hqAddress, country, passportNid, services, permissions, rdbCertId, vatCertId, firstName, lastName, tempEmail, tempPassword, } = req.body;
    let password_new = userType == "VENDOR" ? password : (0, users_3.generatePassword)(8);
    let number = yield (0, users_3.generateUserNumber)();
    let userToCreate = new users_1.User(userType, email, telephone, experienceDurationInYears, experienceDurationInMonths, webSite, status, (0, users_3.hashPassword)(password_new), createdOn, createdBy, rating, tin, companyName, number, notes, department, contactPersonNames, title, hqAddress, country, passportNid, services, permissions, rdbCertId, vatCertId, firstName, lastName, tempEmail, (0, users_3.hashPassword)(tempPassword || "tempPassword"));
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
    let { approvedBy, avgRate } = req.body;
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
exports.userRouter.put("/recoverPassword/:email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email } = req.params;
    try {
        res.send(yield sendRecoverPasswordNotification(email));
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
}));
exports.userRouter.put("/resetPassword/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let { token, newPassword } = req.body;
    if (!id)
        res.status(404).send({ errorMessage: "No userId specified" });
    else if (!token)
        res.status(404).send({ errorMessage: "No token provided" });
    else {
        try {
            let validToken = jsonwebtoken_1.default.verify(token, exports.SALT);
            if (validToken) {
                let _newPassword = (0, users_3.hashPassword)(newPassword);
                let updatedUser = yield users_4.UserModel.findByIdAndUpdate(id, { $set: { password: _newPassword } }, {
                    new: true,
                });
                res.status(201).send({ updatedUser });
            }
            else {
                res.status(401).send({ errorMessage: "Invalid token" });
            }
        }
        catch (err) {
            res.status(500).send({ error: err });
        }
    }
}));
function sendRecoverPasswordNotification(email) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!email)
            throw { errorMessage: "No email specified" };
        // res.status(404).send();
        else {
            try {
                // let newPassword = hashPassword(generatePassword(8));
                let updatedUser = yield (0, users_2.getUserByEmail)(email);
                let token = "";
                if (updatedUser) {
                    token = jsonwebtoken_1.default.sign({
                        email: updatedUser.email,
                        firstName: updatedUser.firstName,
                    }, "968d8b95-72cd-4470-b13e-1017138d32cf", { expiresIn: "14d" });
                }
                if (updatedUser) {
                    yield (0, sendEmailNode_1.send)("from", email, "Password recovery Instructions", JSON.stringify({ user: updatedUser, token }), "html", "preGoLive");
                    return updatedUser;
                    // res.status(201).send({ updatedUser });
                }
                else {
                    throw { errorMessage: "The provided email does not exist!" };
                    // res
                    //   .status(404)
                    //   .send();
                }
            }
            catch (err) {
                throw { error: err };
                // res.status(500).send();
            }
        }
    });
}
function sendNotificationToAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        let users = yield (0, users_2.getAllInternalUsers)();
        users === null || users === void 0 ? void 0 : users.forEach((user) => __awaiter(this, void 0, void 0, function* () {
            yield sendRecoverPasswordNotification(user === null || user === void 0 ? void 0 : user.email);
        }));
    });
}
exports.sendNotificationToAllUsers = sendNotificationToAllUsers;
