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
exports.getSeriesByDescription = exports.getAllSeries = void 0;
const series_1 = require("../models/series");
function getAllSeries() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let series = yield series_1.SeriesModel.find();
            return series;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`
            };
        }
    });
}
exports.getAllSeries = getAllSeries;
function getSeriesByDescription(desc) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(desc);
            let series = yield series_1.SeriesModel.find({ seriesDesc: desc });
            console.log(series);
            return (_a = series[0]) === null || _a === void 0 ? void 0 : _a.series;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`
            };
        }
    });
}
exports.getSeriesByDescription = getSeriesByDescription;
