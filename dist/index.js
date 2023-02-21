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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const usersRoute_1 = require("./routes/usersRoute");
const requestsRoute_1 = require("./routes/requestsRoute");
const serviceCategories_1 = require("./routes/serviceCategories");
const dptRoute_1 = require("./routes/dptRoute");
const tenders_1 = require("./routes/tenders");
const bidSubmissionsRoute_1 = require("./routes/bidSubmissionsRoute");
const purchaseOrders_1 = require("./routes/purchaseOrders");
const contracts_1 = require("./routes/contracts");
const budgetLinesRoute_1 = require("./routes/budgetLinesRoute");
const upload_1 = require("./routes/upload");
const b1_1 = __importDefault(require("./services/b1"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_ts_1 = __importDefault(require("cors-ts"));
const node_localstorage_1 = require("node-localstorage");
let localstorage = new node_localstorage_1.LocalStorage("./scratch");
const PORT = process.env.EPROC_PORT ? process.env.EPROC_PORT : 9999;
const DB_USER = process.env.EPROC_DB_USER;
const DB_PASSWORD = process.env.EPROC_DB_PASSWORD;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
//Set up default mongoose connection
var mongoDB = `mongodb://${DB_USER}:${DB_PASSWORD}@127.0.0.1:27017/eproc?authSource=admin`;
mongoose_1.default.connect(mongoDB);
//Get the default connection
var db = mongoose_1.default.connection;
//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
// db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("connected to db"));
//Basic Authorization
let auth = (req, res, next) => {
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
const app = (0, express_1.default)();
app.use((0, cors_ts_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use("/users", auth, usersRoute_1.userRouter);
app.use("/requests", auth, requestsRoute_1.requetsRouter);
app.use("/dpts", auth, dptRoute_1.dptRouter);
app.use("/serviceCategories", auth, serviceCategories_1.serviceCategoryRouter);
app.use("/tenders", auth, tenders_1.tenderRouter);
app.use("/submissions", auth, bidSubmissionsRoute_1.submissionsRouter);
app.use("/purchaseOrders", auth, purchaseOrders_1.poRouter);
app.use("/contracts", auth, contracts_1.contractRouter);
app.use("/budgetLines", auth, budgetLinesRoute_1.budgetLinesRouter);
app.use("/uploads", upload_1.uploadRouter);
app.use('/b1', b1_1.default);
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(localstorage.getItem('cookie'))
    // await sapLogin()
    console.log(`App listening on port ${PORT}`);
}));
