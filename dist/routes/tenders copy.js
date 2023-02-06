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
exports.tenderRouter = void 0;
const express_1 = require("express");
const tenders_1 = require("../classrepo/tenders");
const tenders_2 = require("../controllers/tenders");
const tenders_3 = require("../services/tenders");
exports.tenderRouter = (0, express_1.Router)();
exports.tenderRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, tenders_2.getAllTenders)());
}));
exports.tenderRouter.get('/countsByDep', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, tenders_2.getTendCountsByDepartment)());
}));
exports.tenderRouter.get('/countsByCat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, tenders_2.getTendCountsByCategory)());
}));
exports.tenderRouter.get('/stats', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let allTenders = yield (0, tenders_2.getAllTenders)();
    let openTenders = yield (0, tenders_2.getOpenTenders)();
    let closedTenders = yield (0, tenders_2.getClosedTenders)();
    res.send({
        total: allTenders.length,
        open: openTenders.length,
        closed: closedTenders.length
    });
}));
exports.tenderRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { createdBy, items, dueDate, status, attachementUrls, submissionDeadLine, torsUrl, purchaseRequest } = req.body;
    let number = yield (0, tenders_3.generateTenderNumber)();
    let itemObjects = items.map((i) => {
        if (!i.currency)
            i.currency = 'RWF';
        return i;
    });
    let tenderToCreate = new tenders_1.Tender(createdBy, itemObjects, dueDate, status, attachementUrls, number, submissionDeadLine, torsUrl, purchaseRequest);
    let createdTender = yield (0, tenders_2.saveTender)(tenderToCreate);
    res.status(201).send(createdTender);
}));
exports.tenderRouter.put('/status/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let { status } = req.body;
    res.send(yield (0, tenders_2.updateTenderStatus)(id, status));
}));
