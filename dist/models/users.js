"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
const crypto_1 = __importDefault(require("crypto"));
exports.UserSchema = new mongoose_1.Schema({
    userType: {
        type: String,
        defaul: "VENDOR",
    },
    contactPersonNames: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        dropDups: true,
    },
    telephone: {
        type: String,
    },
    experienceDurationInYears: {
        type: Number,
    },
    experienceDurationInMonths: {
        type: Number,
    },
    webSite: {
        type: String,
    },
    status: {
        type: String,
        default: "created",
    },
    password: {
        type: String,
    },
    createdOn: { type: Date, default: Date.now() },
    createdBy: mongoose_1.Types.ObjectId,
    rating: {
        type: Number,
    },
    tin: {
        type: Number,
    },
    number: {
        type: Number,
        unique: true,
        dropDups: true,
    },
    passportNid: {
        type: String,
    },
    hqAddress: {
        type: String,
    },
    country: {
        type: String,
    },
    notes: {
        type: String,
    },
    department: {
        type: mongoose_1.Types.ObjectId,
        ref: "Department",
    },
    companyName: {
        type: String,
        unique: true,
    },
    services: Array,
    permissions: Object,
    title: {
        type: String,
    },
    rdbCertId: {
        type: String,
    },
    vatCertId: {
        type: String,
    },
    lastName: {
        type: String,
    },
    firstName: {
        type: String,
    },
    tempEmail: {
        type: String
    },
    tempPassword: {
        type: String
    }
});
// Method to set salt and hash the password for a user
exports.UserSchema.methods.setPassword = function (password) {
    // Creating a unique salt for a particular user
    this.salt = crypto_1.default.randomBytes(16).toString("hex");
    // Hashing user's salt and password with 1000 iterations,
    this.hash = crypto_1.default
        .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
        .toString(`hex`);
};
// Method to check the entered password is correct or not
exports.UserSchema.methods.validPassword = function (password) {
    var hash = crypto_1.default
        .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
        .toString(`hex`);
    return this.hash === hash;
};
exports.UserModel = (0, mongoose_1.model)("User", exports.UserSchema);
