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
exports.getBusinessPartnerByName = exports.getFixedAssets = exports.getVatGroups = void 0;
const express_1 = require("express");
const node_localstorage_1 = require("node-localstorage");
const sapB1Connection_1 = require("../utils/sapB1Connection");
let localstorage = new node_localstorage_1.LocalStorage("./scratch");
let b1Router = (0, express_1.Router)();
b1Router.get("/vatGroups", (req, response) => __awaiter(void 0, void 0, void 0, function* () {
    yield getVatGroups().then(res => {
        response.send(res);
    });
}));
b1Router.get("/fixedAssets", (req, response) => __awaiter(void 0, void 0, void 0, function* () {
    yield getFixedAssets().then(res => {
        response.send(res);
    });
}));
b1Router.get('/businessPartner/:name', (req, response) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.name);
    yield getBusinessPartnerByName(req.params.name).then(res => {
        response.send(res.value);
    });
}));
function getVatGroups() {
    return (0, sapB1Connection_1.sapLogin)()
        .then((res) => __awaiter(this, void 0, void 0, function* () {
        let resJson = yield res.json();
        let COOKIE = res.headers.get("set-cookie");
        localstorage.setItem("cookie", `${COOKIE}`);
        return fetch(`https://192.168.20.181:50000/b1s/v1/VatGroups?$filter=Inactive eq 'tNO'&$select=Code,Name,Category`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${localstorage.getItem("cookie")}`,
            },
        }).then(res => res.json());
    })).catch(err => {
        return err;
        console.log(err);
    });
}
exports.getVatGroups = getVatGroups;
function getFixedAssets() {
    return (0, sapB1Connection_1.sapLogin)()
        .then((res) => __awaiter(this, void 0, void 0, function* () {
        let resJson = yield res.json();
        let COOKIE = res.headers.get("set-cookie");
        localstorage.setItem("cookie", `${COOKIE}`);
        return fetch(`https://192.168.20.181:50000/b1s/v1/Items?$filter= ItemType eq 'itFixedAssets' and CapitalizationDate eq null &$select=ItemCode,ItemName`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${localstorage.getItem("cookie")}`,
            },
        }).then(res => res.json());
    })).catch(err => {
        return err;
        console.log(err);
    });
}
exports.getFixedAssets = getFixedAssets;
function getBusinessPartnerByName(CardName) {
    console.log(CardName);
    return (0, sapB1Connection_1.sapLogin)()
        .then((res) => __awaiter(this, void 0, void 0, function* () {
        let resJson = yield res.json();
        let COOKIE = res.headers.get("set-cookie");
        localstorage.setItem("cookie", `${COOKIE}`);
        return fetch(`https://192.168.20.181:50000/b1s/v1/BusinessPartners?$select=CardName,CardCode&$filter=CardName eq '${CardName}'`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${localstorage.getItem("cookie")}`,
            },
        }).then(res => res.json());
    })).catch(err => {
        return err;
        console.log(err);
    });
}
exports.getBusinessPartnerByName = getBusinessPartnerByName;
exports.default = b1Router;
