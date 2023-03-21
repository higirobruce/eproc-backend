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
exports.updateContract = exports.getContractByVendorId = exports.getContractByStatus = exports.getContractByRequestId = exports.getContractByTenderId = exports.saveContract = exports.getAllContracts = void 0;
const contracts_1 = require("../models/contracts");
/**
 * Get all contracts in the database. This is used to populate the list of contracts when creating a new invoice.
 *
 *
 * @return { Promise } A promise that resolves with an array of ContractModel instances. Each ContractModel is populated with vendor tender and request
 */
function getAllContracts() {
    return __awaiter(this, void 0, void 0, function* () {
        let contracts = yield contracts_1.ContractModel.find()
            .populate("vendor")
            .populate("tender")
            .populate("request")
            .populate("createdBy")
            .populate({
            path: "tender",
            populate: {
                path: "purchaseRequest",
                model: "Request",
            },
        });
        return contracts;
    });
}
exports.getAllContracts = getAllContracts;
/**
 * Saves a contract to the database. This is a convenience method for use in unit tests. It will create a new contract if it does not exist and update any fields that are not provided by the user.
 *
 * @param contract - The contract to save. Must be validated before being saved.
 * @param Contract
 *
 * @return { Promise } Resolves with the newly created contract or rejects with an error message if there was a problem
 */
function saveContract(contract) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield contracts_1.ContractModel.create(contract);
    });
}
exports.saveContract = saveContract;
/**
 * Get a contract by tender id. This is used to create a purchase request and get the contract from the database
 *
 * @param tenderId - The id of the tender
 * @param String
 *
 * @return { Promise } The contract as an object with fields for the tender request vendor createdBy and request
 */
function getContractByTenderId(tenderId) {
    return __awaiter(this, void 0, void 0, function* () {
        let pos = yield contracts_1.ContractModel.find({ tender: tenderId })
            .populate("tender")
            .populate("request")
            .populate("vendor")
            .populate("createdBy")
            .populate({
            path: "tender",
            populate: {
                path: "purchaseRequest",
                model: "Request",
            },
        });
        return pos;
    });
}
exports.getContractByTenderId = getContractByTenderId;
function getContractByRequestId(requestId) {
    return __awaiter(this, void 0, void 0, function* () {
        let pos = yield contracts_1.ContractModel.find({ request: requestId })
            .populate("tender")
            .populate("request")
            .populate("vendor")
            .populate("createdBy")
            .populate({
            path: "tender",
            populate: {
                path: "purchaseRequest",
                model: "Request",
            },
        });
        return pos;
    });
}
exports.getContractByRequestId = getContractByRequestId;
function getContractByStatus(status) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = {};
        if (status === 'all')
            query = {};
        else
            query = { status };
        let pos = yield contracts_1.ContractModel.find(query)
            .populate("tender")
            .populate("request")
            .populate("vendor")
            .populate("createdBy")
            .populate({
            path: "tender",
            populate: {
                path: "purchaseRequest",
                model: "Request",
            },
        });
        return pos;
    });
}
exports.getContractByStatus = getContractByStatus;
/**
 * Get a contract by vendor id. This is used to create a list of contract in order to display the list
 *
 * @param vendorId - Vendor id of the contract
 * @param String
 *
 * @return { Promise } The contract with the id specified in the vendorId as the first parameter. If no contract is found an empty Promise is
 */
function getContractByVendorId(vendorId, status) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = {};
        if (status === "all")
            query = { vendor: vendorId };
        else
            query = { vendor: vendorId, status: status };
        let pos = yield contracts_1.ContractModel.find(query)
            .populate("tender")
            .populate("request")
            .populate("vendor")
            .populate("createdBy")
            .populate({
            path: "tender",
            populate: {
                path: "purchaseRequest",
                model: "Request",
            },
        });
        return pos;
    });
}
exports.getContractByVendorId = getContractByVendorId;
function updateContract(id, contract) {
    return __awaiter(this, void 0, void 0, function* () {
        let newContract = yield contracts_1.ContractModel.findByIdAndUpdate(id, contract, {
            new: true,
        });
        // if (newContract?.status === "reviewed") {
        //   let internallyNotSigned = await ContractModel.find({
        //     "signatories.onBehalfOf": "Irembo Ltd",
        //     "signatories.signed": false,
        //     tender: "640ad9b09058d32c4efacc15",
        //   });
        //   if(internallyNotSigned.length===0){
        //   }
        // }
        return newContract;
    });
}
exports.updateContract = updateContract;
