import { LocalStorage } from "node-localstorage";

let localstorage = new LocalStorage("./scratch");

var config = {
  CompanyDB: process.env.IRMB_B1_COMPANY_DB,
  UserName: process.env.IRMB_B1_USERNAME,
  Password: process.env.IRMB_B1_PASSWORD,
};
export var SESSION_ID: any;
export var COOKIE: any;

export async function sapLogin() {
  return fetch("https://192.168.20.181:50000/b1s/v1/Login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(config),
  })
}

export async function sapLogout() {
  return fetch("https://192.168.20.181:50000/b1s/v1/Logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${localstorage.getItem("cookie")}`,
    },
    body: JSON.stringify(config),
  });
}
