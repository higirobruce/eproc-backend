"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalesOrders = exports.sapLogin = void 0;
const SAPb1 = require("node-sapb1");
const fs = require('fs');
var config = {
    host: "http://192.168.20.181",
    port: 50000,
    version: 2,
    username: "manager",
    password: "K1g@li@123",
    company: "Z_TEST_IREMBO_DB",
    //ca: fs.readFileSync("/path/to/certificate.crt"),
};
function sapLogin() {
    SAPb1.createSession(config, (sap) => {
        // Success
        console.log(sap);
    }, (error, type) => {
        // Error
        // type = 1, Connection errors
        // type = 2, SAP response errors.
        console.log(error, type);
    });
}
exports.sapLogin = sapLogin;
function getSalesOrders() {
    SAPb1.createSession(config, (sap) => {
        sap
            .resource("Orders")
            .queryBuilder()
            .select("DocNum, DocEntry, CardCode, DocumentLines")
            .orderBy("DocNum", "asc")
            .findAll((data) => {
            console.log(data);
        }, (error, type) => {
            console.log(error, type);
        });
    }, (error, type) => {
        console.log(error, type);
    });
}
exports.getSalesOrders = getSalesOrders;
