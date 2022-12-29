"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentModel = exports.DepartmentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.DepartmentSchema = new mongoose_1.Schema({
    number: {
        type: Number, unique: true,
        dropDups: true,
    },
    description: {
        type: String, unique: true,
        dropDups: true,
    }
});
exports.DepartmentModel = (0, mongoose_1.model)('Department', exports.DepartmentSchema);
