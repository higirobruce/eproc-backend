"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRouter = void 0;
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
exports.uploadRouter = (0, express_1.Router)();
exports.uploadRouter.post("/termsOfReference/", (req, res) => {
    var storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "dist/public/termsOfReference");
        },
        filename: function (req, file, cb) {
            cb(null, req.query.id + '.pdf');
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
exports.uploadRouter.post("/rdbCerts/", (req, res) => {
    var storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "dist/public/rdbCerts");
        },
        filename: function (req, file, cb) {
            cb(null, req.query.id + '.pdf');
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
exports.uploadRouter.post("/vatCerts/", (req, res) => {
    var storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "dist/public/vatCerts");
        },
        filename: function (req, file, cb) {
            cb(null, req.query.id + '.pdf');
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
exports.uploadRouter.post("/tenderDocs/", (req, res) => {
    var storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "dist/public/tenderDocs");
        },
        filename: function (req, file, cb) {
            cb(null, req.query.id + '.pdf');
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
exports.uploadRouter.post("/bidDocs/", (req, res) => {
    var storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "dist/public/bidDocs");
        },
        filename: function (req, file, cb) {
            cb(null, req.query.id + '.pdf');
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
exports.uploadRouter.post("/evaluationReports/", (req, res) => {
    var storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "dist/public/evaluationReports");
        },
        filename: function (req, file, cb) {
            cb(null, req.query.id + '.pdf');
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
exports.uploadRouter.get("/:path", (req, res) => {
    let { path } = req.params;
    fs_1.default.stat(`public/termsOfReference/${path}`, (err, stats) => {
        if (err)
            res.send({ err });
        if (stats)
            res.send({ stats });
    });
});
