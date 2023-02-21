import { Router } from "express";
import { LocalStorage } from "node-localstorage";
import { sapLogin, sapLogout } from "../utils/sapB1Connection";

let localstorage = new LocalStorage("./scratch");

let b1Router = Router();

b1Router.get("/vatGroups", async (req, response) => {
  sapLogin()
    .then(async (res) => {
      let resJson = await res.json();
      let COOKIE = res.headers.get("set-cookie");
      localstorage.setItem("cookie", `${COOKIE}`);

      fetch(
        `https://192.168.20.181:50000/b1s/v1/VatGroups?$filter=Inactive eq 'tNO'&$select=Code,Name,Category`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `${localstorage.getItem("cookie")}`,
          },
        }
      )
        .then((res) => res.json())
        .then(async (result) => {
          await sapLogout();
          response.status(200).send(result);
        })
        .catch(async (err) => {
          response.status(500).send(err);
        });
    })
    .catch((err) => {
      response.status(500).send(err);
    });
});

export default b1Router;
