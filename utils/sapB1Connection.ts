const SAPb1 = require("node-sapb1");
const fs = require('fs')
var config = {
  host: "http://192.168.20.181",
  port: 50000,
  version: 2,
  username: "manager",
  password: "K1g@li@123",
  company: "Z_TEST_IREMBO_DB",

  //ca: fs.readFileSync("/path/to/certificate.crt"),
};

export function sapLogin() {
  SAPb1.createSession(
    config,
    (sap:any) => {
      // Success
      console.log(sap)
    },
    (error:any, type:any) => {
      // Error
      // type = 1, Connection errors
      // type = 2, SAP response errors.
      console.log(error, type)
    }
  );
}

export function getSalesOrders() {
  SAPb1.createSession(
    config,
    (sap:any) => {
      sap
        .resource("Orders")
        .queryBuilder()
        .select("DocNum, DocEntry, CardCode, DocumentLines")
        .orderBy("DocNum", "asc")
        .findAll(
          (data:any) => {
            console.log(data);
          },
          (error:any, type:any) => {
            console.log(error, type);
          }
        );
    },
    (error:any, type:any) => {
      console.log(error, type);
    }
  );
}
