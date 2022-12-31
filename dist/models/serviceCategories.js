"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceCategoryModel = exports.ServiceCategory = void 0;
const mongoose_1 = require("mongoose");
exports.ServiceCategory = new mongoose_1.Schema({
    description: {
        type: String, unique: true,
        dropDups: true,
    }
});
exports.ServiceCategoryModel = (0, mongoose_1.model)('ServiceCategory', exports.ServiceCategory);
