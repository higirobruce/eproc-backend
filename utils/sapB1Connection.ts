import { LocalStorage } from "node-localstorage";
import fetch from 'cross-fetch';

let localstorage = new LocalStorage("./dist");

var config = {
  CompanyDB: process.env.IRMB_B1_COMPANY_DB,
  UserName: process.env.IRMB_B1_USERNAME,
  Password: process.env.IRMB_B1_PASSWORD,
};
export var SESSION_ID: any;
export var COOKIE: any;

export async function sapLogin() {
  return fetch(`${process.env.IRMB_B1_SERVER}:${process.env.IRMB_B1_SERVICE_LAYER_PORT}/b1s/v1/Login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(config),
  })
}

export async function sapLogout() {
  return fetch(`${process.env.IRMB_B1_SERVER}:${process.env.IRMB_B1_SERVICE_LAYER_PORT}/b1s/v1/Login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${localstorage.getItem("cookie")}`,
    },
    body: JSON.stringify(config),
  });
}
