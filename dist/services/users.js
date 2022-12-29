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
exports.validPassword = exports.hashPassword = exports.generateUserNumber = void 0;
const users_1 = require("../models/users");
const crypto_1 = __importDefault(require("crypto"));
let SALT = '762f021e88bdfdc80f8e174edbdfaf65';
const generateUserNumber = () => __awaiter(void 0, void 0, void 0, function* () {
    // Get the last saved document
    const lastDocument = yield users_1.UserModel.findOne().sort({ number: -1 });
    // Generate a new 10-digit number, starting from 1000000000 and incrementing by 1
    let newNumber = 1000000;
    if (lastDocument && lastDocument.number) {
        newNumber = lastDocument.number + 1;
    }
    // Return the new number
    return newNumber;
});
exports.generateUserNumber = generateUserNumber;
const hashPassword = (password) => {
    // Creating a unique salt for a particular user 
    // Hashing user's salt and password with 1000 iterations, 
    let hash = crypto_1.default.pbkdf2Sync(password, SALT, 1000, 64, `sha512`).toString(`hex`);
    return hash;
};
exports.hashPassword = hashPassword;
const validPassword = (password, savedPassword) => {
    var hash = crypto_1.default.pbkdf2Sync(password, SALT, 1000, 64, `sha512`).toString(`hex`);
    return savedPassword === hash;
};
exports.validPassword = validPassword;
