
import { createHash } from 'crypto';
import express, { Express, NextFunction, Request, Response } from 'express'

import mongoose, { SchemaTypes } from 'mongoose'
import { userRouter } from './routes/usersRoute';
import { requetsRouter } from './routes/requestsRoute'
import {serviceCategoryRouter} from './routes/serviceCategories'


import bodyParser from 'body-parser';
import cors from 'cors-ts'
import { Department } from './classrepo/departments';
import { saveDepartment, getAllDepartments } from './controllers/departments';
import { dptRouter } from './routes/dptRoute';
import { Request as Req } from './classrepo/requests';
import { PoLineItem } from './classrepo/poLineItems';
import { saveRequest } from './controllers/requests';
import { generateReqNumber } from './services/requests';

const PORT = process.env.EPROC_PORT ? process.env.EPROC_PORT : 9999
const DB_USER = process.env.EPROC_DB_USER 
const DB_PASSWORD = process.env.EPROC_DB_PASSWORD

console.log(DB_USER, DB_PASSWORD)


//Set up default mongoose connection
var mongoDB =
  `mongodb://${DB_USER}:${DB_PASSWORD}@127.0.0.1:27017/eproc?authSource=admin`;


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


app.use('/users', auth, userRouter);
app.use('/requests', auth, requetsRouter);
app.use('/dpts', auth, dptRouter);
app.use('/serviceCategories', auth, serviceCategoryRouter);

app.listen(PORT, async () => {

  console.log(`App listening on port ${PORT}`)
})