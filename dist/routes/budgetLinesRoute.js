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
exports.budgetLinesRouter = void 0;
const express_1 = require("express");
const budgetLines_1 = require("../classrepo/budgetLines");
const budgetLines_2 = require("../controllers/budgetLines");
exports.budgetLinesRouter = (0, express_1.Router)();
exports.budgetLinesRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send(yield (0, budgetLines_2.getAllBudgetLines)());
}));
exports.budgetLinesRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title, subLines } = req.body;
    let budgetLine = new budgetLines_1.BudgetLine(title, subLines);
    res.status(201).send(yield (0, budgetLines_2.saveBudgetLine)(budgetLine));
}));
