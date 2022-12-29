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
const body_parser_1 = __importDefault(require("body-parser"));
const cors_ts_1 = __importDefault(require("cors-ts"));
const dptRoute_1 = require("./routes/dptRoute");
const PORT = process.env.EPROC_PORT ? process.env.EPROC_PORT : 9999;
const DB_USER = process.env.EPROC_DB_USER;
const DB_PASSWORD = process.env.EPROC_DB_PASSWORD;
console.log(DB_USER, DB_PASSWORD);
//Set up default mongoose connection
var mongoDB = `mongodb://${DB_USER}:${DB_PASSWORD}@localhost:27017/eproc?authSource=admin`;
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
app.use('/users', auth, usersRoute_1.userRouter);
app.use('/requests', auth, requestsRoute_1.requetsRouter);
app.use('/dpts', auth, dptRoute_1.dptRouter);
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`App listening on port ${PORT}`);
}));