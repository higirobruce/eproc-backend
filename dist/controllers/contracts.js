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
exports.saveContract = exports.getAllContracts = void 0;
const contracts_1 = require("../models/contracts");
function getAllContracts() {
    return __awaiter(this, void 0, void 0, function* () {
        let contracts = yield contracts_1.ContractModel.find();
        return contracts;
    });
}
exports.getAllContracts = getAllContracts;
function saveContract(contract) {
    return __awaiter(this, void 0, void 0, function* () {
        yield contracts_1.ContractModel.create(contract);
    });
}
exports.saveContract = saveContract;
