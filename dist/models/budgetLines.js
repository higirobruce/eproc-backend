"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetLineModel = exports.BudgetLinesSchema = void 0;
const mongoose_1 = require("mongoose");
exports.BudgetLinesSchema = new mongoose_1.Schema({
    title: {
        type: String
    },
    subLines: []
});
exports.BudgetLineModel = (0, mongoose_1.model)('BudgetLine', exports.BudgetLinesSchema);
