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
exports.generateBidSubmissionNumber = void 0;
const bidSubmissions_1 = require("../models/bidSubmissions");
const generateBidSubmissionNumber = () => __awaiter(void 0, void 0, void 0, function* () {
    // Get the last saved document
    const lastDocument = yield bidSubmissions_1.BidSumbissionModel.findOne().sort({ number: -1 });
    // Generate a new 10-digit number, starting from 1000000000 and incrementing by 1
    let newNumber = 13000000;
    if (lastDocument && lastDocument.number) {
        newNumber = lastDocument.number + 1;
    }
    // Return the new number
    return newNumber;
});
exports.generateBidSubmissionNumber = generateBidSubmissionNumber;
