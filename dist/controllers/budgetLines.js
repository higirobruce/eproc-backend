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
exports.saveBudgetLine = exports.getAllBudgetLines = void 0;
const budgetLines_1 = require("../models/budgetLines");
function getAllBudgetLines() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let dpts = yield budgetLines_1.BudgetLineModel.find();
            return dpts;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`
            };
        }
    });
}
exports.getAllBudgetLines = getAllBudgetLines;
function saveBudgetLine(budgetLine) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let createdBudgetL = yield budgetLines_1.BudgetLineModel.create(budgetLine);
            return createdBudgetL._id;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`
            };
        }
    });
}
exports.saveBudgetLine = saveBudgetLine;
