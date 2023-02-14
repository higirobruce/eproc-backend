"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesModel = exports.Series = void 0;
const mongoose_1 = require("mongoose");
exports.Series = new mongoose_1.Schema({
    series: Number,
    seriesDesc: String
});
exports.SeriesModel = (0, mongoose_1.model)('Series', exports.Series);
