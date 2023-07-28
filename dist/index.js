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
exports.ensureUserAuthorized = void 0;
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
const paymentRequestRoute_1 = require("./routes/paymentRequestRoute");
const b1_1 = __importDefault(require("./services/b1"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_ts_1 = __importDefault(require("cors-ts"));
const node_localstorage_1 = require("node-localstorage");
const path_1 = __importDefault(require("path"));
const logger_1 = require("./utils/logger");
let localstorage = new node_localstorage_1.LocalStorage("./scratch");
const oneDay = 1000 * 60 * 60 * 24;
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
db.on("error", console.error.bind(console, `MongoDB connection error with user:${DB_USER} pwd:${DB_PASSWORD} :`));
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
    logger_1.logger.log({
        level: "error",
        message: `Unauthorized API access was declined.`,
        payload: req.baseUrl,
    });
    res.set("WWW-Authenticate", 'Basic realm="401"'); // change this
    res.status(401).send("Authentication required."); // custom message
};
const app = (0, express_1.default)();
let ensureUserAuthorized = (req, res, next) => {
    try {
        let token = req.headers.token;
        if (!token) {
            res.status(401).send('Unauthorized');
        }
        else {
            let user = jsonwebtoken_1.default.verify(token, usersRoute_1.SALT);
            req.session.user = user;
            next();
        }
    }
    catch (err) {
        res.status(401).send('Please send a valid access token in the header');
    }
};
exports.ensureUserAuthorized = ensureUserAuthorized;
app.use((0, express_session_1.default)({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
}));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_ts_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/users", auth, usersRoute_1.userRouter);
app.use("/requests", exports.ensureUserAuthorized, requestsRoute_1.requetsRouter);
app.use("/dpts", dptRoute_1.dptRouter);
app.use("/serviceCategories", serviceCategories_1.serviceCategoryRouter);
app.use("/tenders", exports.ensureUserAuthorized, tenders_1.tenderRouter);
app.use("/submissions", exports.ensureUserAuthorized, bidSubmissionsRoute_1.submissionsRouter);
app.use("/purchaseOrders", exports.ensureUserAuthorized, purchaseOrders_1.poRouter);
app.use("/contracts", exports.ensureUserAuthorized, contracts_1.contractRouter);
app.use("/budgetLines", exports.ensureUserAuthorized, budgetLinesRoute_1.budgetLinesRouter);
app.use("/paymentRequests", exports.ensureUserAuthorized, paymentRequestRoute_1.paymentRequestRouter);
app.use("/uploads", upload_1.uploadRouter);
app.use("/b1", exports.ensureUserAuthorized, b1_1.default);
app.get("/file/:folder/:name", function (req, res, next) {
    var folder = req.params.folder;
    var options = {
        root: path_1.default.join(__dirname, "public/", folder),
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
        }
        else {
        }
    });
});
let server = app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`App listening on port ${PORT}`);
    // await sendNotificationToAllUsers();
    logger_1.logger.log({
        level: "info",
        message: `App started on port ${PORT}`,
    });
}));
process.on("SIGTERM", () => {
    logger_1.logger.log({
        level: "error",
        message: `SIGTERM signal detected`,
    });
    logger_1.logger.log({
        level: "error",
        message: `Closing the server`,
    });
    server.close(() => {
        logger_1.logger.log({
            level: "error",
            message: `HTTP server closed`,
        });
        // boolean means [force], see in mongoose doc
        mongoose_1.default.connection.close(false, () => {
            logger_1.logger.log({
                level: "error",
                message: `MongoDb connection closed.`,
            });
            process.exit(0);
        });
    });
});
process.on("SIGINT", () => {
    logger_1.logger.log({
        level: "error",
        message: `SIGINT signal detected`,
    });
    logger_1.logger.log({
        level: "error",
        message: `Closing the server`,
    });
    server.close(() => {
        logger_1.logger.log({
            level: "error",
            message: `HTTP server closed`,
        });
        // boolean means [force], see in mongoose doc
        mongoose_1.default.connection.close(false, () => {
            logger_1.logger.log({
                level: "error",
                message: `MongoDb connection closed.`,
            });
            process.exit(0);
        });
    });
});
