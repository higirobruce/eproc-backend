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
exports.saveDepartment = exports.getAllDepartments = void 0;
const departments_1 = require("../models/departments");
function getAllDepartments() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let dpts = yield departments_1.DepartmentModel.find();
            console.log(dpts);
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
exports.getAllDepartments = getAllDepartments;
function saveDepartment(dpt) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let createdDpt = yield departments_1.DepartmentModel.create(dpt);
            return createdDpt._id;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`
            };
        }
    });
}
exports.saveDepartment = saveDepartment;
