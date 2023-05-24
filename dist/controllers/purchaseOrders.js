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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVendorRate = exports.updatePo = exports.updateB1Po = exports.savePOInB1 = exports.savePO = exports.updateProgress = exports.updatePOStatus = exports.getPOByVendorId = exports.getPOByRequestId = exports.getPOById = exports.getPOByTenderId = exports.getAllPOs = void 0;
const purchaseOrders_1 = require("../models/purchaseOrders");
const node_localstorage_1 = require("node-localstorage");
const sapB1Connection_1 = require("../utils/sapB1Connection");
const mongoose_1 = __importDefault(require("mongoose"));
let localstorage = new node_localstorage_1.LocalStorage("./scratch");
/**
 * Get all POs in the database. This is used to populate the list of purchases and get the purchase order for each purchase
 *
 *
 * @return { Promise } A promise that resolves with an array
 */
function getAllPOs() {
    return __awaiter(this, void 0, void 0, function* () {
        let pos = yield purchaseOrders_1.PurchaseOrderModel.find()
            .populate("tender")
            .populate("vendor")
            .populate("request")
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
exports.getAllPOs = getAllPOs;
/**
 * Get purchase order by tender id. This is used to populate the form fields when creating a new purchase order
 *
 * @param tenderId - The id of the tender
 * @param String
 *
 * @return { Object } The purchase order with the tender id as key and the request as value. If there is no purchase order with the tender id null is
 */
function getPOByTenderId(tenderId) {
    return __awaiter(this, void 0, void 0, function* () {
        let pos = yield purchaseOrders_1.PurchaseOrderModel.find({ tender: tenderId })
            .populate("request")
            .populate("tender")
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
exports.getPOByTenderId = getPOByTenderId;
function getPOById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let pos = yield purchaseOrders_1.PurchaseOrderModel.findById(id)
            .populate("request")
            .populate("tender")
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
exports.getPOById = getPOById;
function getPOByRequestId(requestId) {
    return __awaiter(this, void 0, void 0, function* () {
        let pos = yield purchaseOrders_1.PurchaseOrderModel.find({ request: requestId })
            .populate("request")
            .populate("tender")
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
exports.getPOByRequestId = getPOByRequestId;
/**
 * Get purchase order by vendor id. This is used for testing purposes to ensure that the user doesn't accidentally get an error when trying to create a purchase order that does not exist.
 *
 * @param vendorId - Vendor id to look for. If null or " " will return all pos.
 * @param String
 *
 * @return { Promise } The promise is resolved with an object with the following properties : tender : The user's tender createdBy : The user's created by
 */
function getPOByVendorId(vendorId) {
    return __awaiter(this, void 0, void 0, function* () {
        let pos = yield purchaseOrders_1.PurchaseOrderModel.find({ vendor: vendorId })
            .populate("tender")
            .populate("vendor")
            .populate("createdBy");
        return pos;
    });
}
exports.getPOByVendorId = getPOByVendorId;
/**
 * Updates the status of Purchase Order. This is a convenience method for updating the status of a Purchase Order
 *
 * @param id - The id of the Po to update
 * @param String
 * @param newStatus - The status to set the PO to.
 *
 * @return { Object } The result of the action i. e. { message : true|false errorMessage :'Error '
 */
function updatePOStatus(id, newStatus) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield purchaseOrders_1.PurchaseOrderModel.findByIdAndUpdate(id, {
                $set: { status: newStatus },
            });
            return { message: "done" };
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`,
            };
        }
    });
}
exports.updatePOStatus = updatePOStatus;
/**
 * Updates the progress of purchase order. It is used to update the delivery progress of a purchased order
 *
 * @param id - ID of the purchase order
 * @param String
 * @param progress - String representing the amount of the order that has been dismissed
 *
 * @return { Object } Object with error flag and errorMessage set if an error occured during update otherwise an error is
 */
function updateProgress(id, updates) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let a = yield purchaseOrders_1.PurchaseOrderModel.findByIdAndUpdate(id, updates, { returnOriginal: false });
            return a;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`,
            };
        }
    });
}
exports.updateProgress = updateProgress;
/**
 * Saves a Purchase Order to the database. This will throw if there is an error saving the PO.
 *
 * @param po - The Purchase Order to save. Must be an instance of PurchaseOrder
 * @param PurchaseOrder
 *
 * @return { Promise } The created PO
 */
function savePO(po) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let createdRecord = yield purchaseOrders_1.PurchaseOrderModel.create(po);
            return createdRecord;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    });
}
exports.savePO = savePO;
function savePOInB1(CardCode, DocType, DocumentLines) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, sapB1Connection_1.sapLogin)().then((res) => __awaiter(this, void 0, void 0, function* () {
            let COOKIE = res.headers.get("set-cookie");
            localstorage.setItem("cookie", `${COOKIE}`);
            return fetch("https://192.168.20.181:50000/b1s/v1/PurchaseOrders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `${localstorage.getItem("cookie")}`,
                },
                body: JSON.stringify({ CardCode, DocType, DocumentLines }),
            })
                .then((res) => res.json())
                .then((res) => {
                console.log(res);
                return res;
            })
                .catch((err) => {
                console.log(err);
                return { error: err };
            });
        }));
    });
}
exports.savePOInB1 = savePOInB1;
function updateB1Po(CardCode, body) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, sapB1Connection_1.sapLogin)().then((res) => __awaiter(this, void 0, void 0, function* () {
            let COOKIE = res.headers.get("set-cookie");
            localstorage.setItem("cookie", `${COOKIE}`);
            return fetch(`https://192.168.20.181:50000/b1s/v1/PurchaseOrders(${CardCode})`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `${localstorage.getItem("cookie")}`,
                },
                body: JSON.stringify(body),
            })
                .then((res) => res.json())
                .then((res) => { return res; })
                .catch((err) => {
                return err;
            });
        }));
    });
}
exports.updateB1Po = updateB1Po;
function updatePo(id, po) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield purchaseOrders_1.PurchaseOrderModel.findByIdAndUpdate(id, po, { new: true });
    });
}
exports.updatePo = updatePo;
function getVendorRate(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let pipeline = [
            {
                $match: {
                    vendor: new mongoose_1.default.Types.ObjectId(id)
                },
            },
            {
                $group: {
                    _id: "$vendor",
                    avgRate: {
                        $avg: "$rate",
                    },
                },
            },
        ];
        try {
            let avg = yield purchaseOrders_1.PurchaseOrderModel.aggregate(pipeline);
            return avg;
        }
        catch (err) {
            return {
                error: true,
                errorMessage: `Error :${err}`,
            };
        }
    });
}
exports.getVendorRate = getVendorRate;
