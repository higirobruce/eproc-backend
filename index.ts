import express, { Express, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { userRouter } from "./routes/usersRoute";
import { requetsRouter } from "./routes/requestsRoute";
import { serviceCategoryRouter } from "./routes/serviceCategories";
import { dptRouter } from "./routes/dptRoute";
import { tenderRouter } from "./routes/tenders";
import { submissionsRouter } from "./routes/bidSubmissionsRoute";
import { poRouter } from "./routes/purchaseOrders";
import { contractRouter } from "./routes/contracts";
import { budgetLinesRouter } from "./routes/budgetLinesRoute";
import { uploadRouter } from "./routes/upload";
import b1Router from "./services/b1";

import bodyParser from "body-parser";
import cors from "cors-ts";
import { sapLogin, SESSION_ID } from "./utils/sapB1Connection";
import { createSupplierinB1, getB1SeriesFromNames } from "./controllers/users";
import { getSeriesByDescription } from "./controllers/series";
import { LocalStorage } from "node-localstorage";
import { savePOInB1 } from "./controllers/purchaseOrders";
import path from "path";
import { send } from "./utils/sendEmailNode";
import { generatePassword } from "./services/users";

let localstorage = new LocalStorage("./scratch");

const PORT = process.env.EPROC_PORT ? process.env.EPROC_PORT : 9999;
const DB_USER = process.env.EPROC_DB_USER;
const DB_PASSWORD = process.env.EPROC_DB_PASSWORD;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
//Set up default mongoose connection
var mongoDB = `mongodb://${DB_USER}:${DB_PASSWORD}@127.0.0.1:27017/eproc?authSource=admin`;

mongoose.connect(mongoDB);
//Get the default connection

var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
// db.on("error", console.error.bind(console, "MongoDB connection error:"));

db.once("open", () => console.log("connected to db"));

//Basic Authorization
let auth = (req: Request, res: Response, next: NextFunction) => {
  const auth = { login: "eproc@2023", password: "rT%b23W3UHdRKavrJ!6Y" }; // change this
  // const auth = {
  //   login: process.env.CONS_API_USER,
  //   password: process.env.CONS_API_PASS,
  // }; // change this
  const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
  const [login, password] = Buffer.from(b64auth, "base64")
    .toString()
    .split(":");
  if (login && password && login === auth.login && password === auth.password) {
    return next();
  }
  res.set("WWW-Authenticate", 'Basic realm="401"'); // change this
  res.status(401).send("Authentication required."); // custom message
};

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/users", userRouter);
app.use("/requests", requetsRouter);
app.use("/dpts", dptRouter);
app.use("/serviceCategories", serviceCategoryRouter);
app.use("/tenders", tenderRouter);
app.use("/submissions", submissionsRouter);
app.use("/purchaseOrders", poRouter);
app.use("/contracts", contractRouter);
app.use("/budgetLines", auth, budgetLinesRouter);
app.use("/uploads", uploadRouter);
app.use("/b1", b1Router);
app.get("/file/:folder/:name", function (req, res, next) {
  var folder = req.params.folder;
  var options = {
    root: path.join(__dirname, "public/", folder),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };
  var fileName = req.params.name;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next("File not found! 😏");
    } else {
      
    }

  });
});

app.listen(PORT, async () => {
  // console.log(localstorage.getItem('cookie'))
  // await sapLogin()

  console.log(`App listening on port ${PORT}`);
});
