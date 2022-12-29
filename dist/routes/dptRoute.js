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
exports.dptRouter = void 0;
const express_1 = require("express");
const departments_1 = require("../controllers/departments");
exports.dptRouter = (0, express_1.Router)();
exports.dptRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('get dpts');
    res.status(200).send(yield (0, departments_1.getAllDepartments)());
}));
