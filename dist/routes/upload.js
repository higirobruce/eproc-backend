"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRouter = void 0;
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const crypto_1 = require("crypto");
const path_1 = __importDefault(require("path"));
exports.uploadRouter = (0, express_1.Router)();
exports.uploadRouter.post("/termsOfReference/", (req, res) => {
    var storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "dist/public/termsOfReference");
        },
        filename: function (req, file, cb) {
            // cb(null, req.query.id+'.pdf');
            let fileName = (0, crypto_1.randomUUID)();
            cb(null, fileName + ".pdf");
        },
    });
    var upload = (0, multer_1.default)({ storage: storage }).array("files[]");
    // var upload = multer({ storage: storage }).array('file',100)
    upload(req, res, function (err) {
        if (err instanceof multer_1.default.MulterError) {
            console.log(err);
            return res.status(500);
        }
        else if (err) {
            console.log(err);
            return res.status(500);
        }
        return res.status(200).send(req.files);
    });
});
exports.uploadRouter.post("/rdbCerts/", (req, res) => {
    var storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "dist/public/rdbCerts");
        },
        filename: function (req, file, cb) {
            cb(null, req.query.id + ".pdf");
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
        console.log(req.file);
        return res.status(200).send(req.file);
    });
});
exports.uploadRouter.post("/vatCerts/", (req, res) => {
    var storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "dist/public/vatCerts");
        },
        filename: function (req, file, cb) {
            cb(null, req.query.id + ".pdf");
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
            cb(null, req.query.id + ".pdf");
        },
    });
    console.log('Tender doc');
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
            cb(null, req.query.id + ".pdf");
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
            cb(null, req.query.id + ".pdf");
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
exports.uploadRouter.post("/reqAttachments/", (req, res) => {
    var storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "dist/public/reqAttachments");
        },
        filename: function (req, file, cb) {
            cb(null, req.query.id + ".pdf");
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
exports.uploadRouter.post("/paymentRequests/", (req, res) => {
    var storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "dist/public/paymentRequests");
        },
        filename: function (req, file, cb) {
            // cb(null, req.query.id+'.pdf');
            let fileName = (0, crypto_1.randomUUID)();
            cb(null, fileName + ".pdf");
        },
    });
    var upload = (0, multer_1.default)({ storage: storage }).array("files[]");
    // var upload = multer({ storage: storage }).array('file',100)
    upload(req, res, function (err) {
        if (err instanceof multer_1.default.MulterError) {
            console.log(err);
            return res.status(500);
        }
        else if (err) {
            console.log(err);
            return res.status(500);
        }
        console.log(req.files);
        return res.status(200).send(req.files);
    });
});
exports.uploadRouter.post("/updatePaymentRequests/", (req, res) => {
    var storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "dist/public/paymentRequests");
        },
        filename: function (req, file, cb) {
            cb(null, req.query.id + ".pdf");
        },
    });
    console.log('fillles');
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
exports.uploadRouter.get("/check/file/:folder/:name", function (req, res, next) {
    var folder = req.params.folder;
    let filePath = path_1.default.join(__dirname, "public/", folder);
    console.log(filePath);
    if (fs_1.default.existsSync(filePath)) {
        res.send(true);
    }
    else {
        res.send(false);
    }
});
