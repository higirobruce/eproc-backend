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
exports.sapLogout = exports.sapLogin = exports.COOKIE = exports.SESSION_ID = void 0;
const node_localstorage_1 = require("node-localstorage");
let localstorage = new node_localstorage_1.LocalStorage("./dist");
var config = {
    CompanyDB: process.env.IRMB_B1_COMPANY_DB,
    UserName: process.env.IRMB_B1_USERNAME,
    Password: process.env.IRMB_B1_PASSWORD,
};
function sapLogin() {
    return __awaiter(this, void 0, void 0, function* () {
        return fetch(`${process.env.IRMB_B1_SERVER}:${process.env.IRMB_B1_SERVICE_LAYER_PORT}/b1s/v1/Login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(config),
        });
    });
}
exports.sapLogin = sapLogin;
function sapLogout() {
    return __awaiter(this, void 0, void 0, function* () {
        return fetch(`${process.env.IRMB_B1_SERVER}:${process.env.IRMB_B1_SERVICE_LAYER_PORT}/b1s/v1/Login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${localstorage.getItem("cookie")}`,
            },
            body: JSON.stringify(config),
        });
    });
}
exports.sapLogout = sapLogout;
