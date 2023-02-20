"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRouter = void 0;
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
exports.uploadRouter = (0, express_1.Router)();
exports.uploadRouter.post("/termsOfReference", (req, res) => {
    var storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "public/termsOfReference");
        },
        filename: function (req, file, cb) {
            cb(null, "TOR " + "-" + file.originalname);
        },
    });
    var upload = (0, multer_1.default)({ storage: storage }).single("file");
    upload(req, res, function (err) {
        if (err instanceof multer_1.default.MulterError) {
            console.log(err);
            return res.status(500);
        }
        else if (err) {
            console.log(err);
            return res.status(500);
        }
        return res.status(200).send(req.file);
    });
});
