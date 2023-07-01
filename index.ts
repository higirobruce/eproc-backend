import express, { Express, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import {
  SALT,
  sendNotificationToAllUsers,
  userRouter,
} from "./routes/usersRoute";
import { requetsRouter } from "./routes/requestsRoute";
import { serviceCategoryRouter } from "./routes/serviceCategories";
import { dptRouter } from "./routes/dptRoute";
import { tenderRouter } from "./routes/tenders";
import { submissionsRouter } from "./routes/bidSubmissionsRoute";
import { poRouter } from "./routes/purchaseOrders";
import { contractRouter } from "./routes/contracts";
import { budgetLinesRouter } from "./routes/budgetLinesRoute";
import { uploadRouter } from "./routes/upload";
import { paymentRequestRouter } from "./routes/paymentRequestRoute";
import b1Router from "./services/b1";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore = require("connect-mongo");
import jwt, { JwtPayload } from "jsonwebtoken";

import bodyParser from "body-parser";
import cors from "cors-ts";
import { LocalStorage } from "node-localstorage";
import path from "path";
import { logger } from "./utils/logger";

let localstorage = new LocalStorage("./scratch");
const oneDay = 1000 * 60 * 60 * 24;

declare module "express-session" {
  export interface SessionData {
    user: any;
    userId: any;
    accessToken: any;
  }
}

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
db.on(
  "error",
  console.error.bind(
    console,
    `MongoDB connection error with user:${DB_USER} pwd:${DB_PASSWORD} :`
  )
);
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
  logger.log({
    level: "error",
    message: `Unauthorized API access was declined.`,
    payload: req.baseUrl,
  });
  res.set("WWW-Authenticate", 'Basic realm="401"'); // change this
  res.status(401).send("Authentication required."); // custom message
};

const app: Express = express();

export let ensureUserAuthorized = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.token;
    if (!token) {

      res.status(401).send('Unauthorized')
    } else {
      let user = jwt.verify(token as string, SALT);
      req.session.user = user
      
      next();
    }
  } catch (err) {
    res.status(401).send('Please send a valid access token in the header')
  }
};
app.use(
  session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/users", auth, userRouter);
app.use("/requests", ensureUserAuthorized, requetsRouter);
app.use("/dpts", dptRouter);
app.use("/serviceCategories", serviceCategoryRouter);
app.use("/tenders",ensureUserAuthorized, tenderRouter);
app.use("/submissions",ensureUserAuthorized, submissionsRouter);
app.use("/purchaseOrders",ensureUserAuthorized, poRouter);
app.use("/contracts",ensureUserAuthorized, contractRouter);
app.use("/budgetLines",ensureUserAuthorized, budgetLinesRouter);
app.use("/paymentRequests",ensureUserAuthorized, paymentRequestRouter);
app.use("/uploads", uploadRouter);
app.use("/b1", ensureUserAuthorized,b1Router);
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

let server = app.listen(PORT, async () => {
  console.log(`App listening on port ${PORT}`);

  // await sendNotificationToAllUsers();
  logger.log({
    level: "info",
    message: `App started on port ${PORT}`,
  });
});

process.on("SIGTERM", () => {
  logger.log({
    level: "error",
    message: `SIGTERM signal detected`,
  });
  logger.log({
    level: "error",
    message: `Closing the server`,
  });
  server.close(() => {
    logger.log({
      level: "error",
      message: `HTTP server closed`,
    });
    // boolean means [force], see in mongoose doc
    mongoose.connection.close(false, () => {
      logger.log({
        level: "error",
        message: `MongoDb connection closed.`,
      });
      process.exit(0);
    });
  });
});

process.on("SIGINT", () => {
  logger.log({
    level: "error",
    message: `SIGINT signal detected`,
  });
  logger.log({
    level: "error",
    message: `Closing the server`,
  });
  server.close(() => {
    logger.log({
      level: "error",
      message: `HTTP server closed`,
    });
    // boolean means [force], see in mongoose doc
    mongoose.connection.close(false, () => {
      logger.log({
        level: "error",
        message: `MongoDb connection closed.`,
      });
      process.exit(0);
    });
  });
});
