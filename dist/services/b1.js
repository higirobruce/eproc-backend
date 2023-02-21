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
const express_1 = require("express");
const node_localstorage_1 = require("node-localstorage");
const sapB1Connection_1 = require("../utils/sapB1Connection");
let localstorage = new node_localstorage_1.LocalStorage("./scratch");
let b1Router = (0, express_1.Router)();
b1Router.get("/vatGroups", (req, response) => __awaiter(void 0, void 0, void 0, function* () {
    (0, sapB1Connection_1.sapLogin)()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        let resJson = yield res.json();
        let COOKIE = res.headers.get("set-cookie");
        localstorage.setItem("cookie", `${COOKIE}`);
        fetch(`https://192.168.20.181:50000/b1s/v1/VatGroups?$filter=Inactive eq 'tNO'&$select=Code,Name,Category`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${localstorage.getItem("cookie")}`,
            },
        })
            .then((res) => res.json())
            .then((result) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, sapB1Connection_1.sapLogout)();
            response.status(200).send(result);
        }))
            .catch((err) => __awaiter(void 0, void 0, void 0, function* () {
            response.status(500).send(err);
        }));
    }))
        .catch((err) => {
        response.status(500).send(err);
    });
}));
exports.default = b1Router;
