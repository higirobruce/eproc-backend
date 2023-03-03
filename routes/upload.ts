import multer, { diskStorage } from "multer";
import { Router } from "express";
import fs from "fs";

export let uploadRouter = Router();

uploadRouter.post("/termsOfReference/", (req, res) => {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "dist/public/termsOfReference");
    },
    filename: function (req, file, cb) {
      cb(null, req.query.id+'.pdf');
    },
  });

  var upload = multer({ storage: storage }).single("file");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500);
    } else if (err) {
      console.log(err);
      return res.status(500);
    }

    return res.status(200).send(req.file);
  });
});

uploadRouter.post("/rdbCerts/", (req, res) => {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "dist/public/rdbCerts");
    },
    filename: function (req, file, cb) {
      cb(null, req.query.id+'.pdf');
    },
  });

  var upload = multer({ storage: storage }).single("file");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500);
    } else if (err) {
      console.log(err);
      return res.status(500);
    }

    return res.status(200).send(req.file);
  });
});

uploadRouter.post("/vatCerts/", (req, res) => {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "dist/public/vatCerts");
    },
    filename: function (req, file, cb) {
      cb(null, req.query.id+'.pdf');
    },
  });

  var upload = multer({ storage: storage }).single("file");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500);
    } else if (err) {
      console.log(err);
      return res.status(500);
    }

    return res.status(200).send(req.file);
  });
});

uploadRouter.post("/tenderDocs/", (req, res) => {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "dist/public/tenderDocs");
    },
    filename: function (req, file, cb) {
      cb(null, req.query.id+'.pdf');
    },
  });

  var upload = multer({ storage: storage }).single("file");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500);
    } else if (err) {
      console.log(err);
      return res.status(500);
    }

    return res.status(200).send(req.file);
  });
});

uploadRouter.post("/bidDocs/", (req, res) => {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "dist/public/bidDocs");
    },
    filename: function (req, file, cb) {
      cb(null, req.query.id+'.pdf');
    },
  });

  var upload = multer({ storage: storage }).single("file");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500);
    } else if (err) {
      console.log(err);
      return res.status(500);
    }

    return res.status(200).send(req.file);
  });
});

uploadRouter.post("/evaluationReports/", (req, res) => {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "dist/public/evaluationReports");
    },
    filename: function (req, file, cb) {
      cb(null, req.query.id+'.pdf');
    },
  });

  var upload = multer({ storage: storage }).single("file");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500);
    } else if (err) {
      console.log(err);
      return res.status(500);
    }

    return res.status(200).send(req.file);
  });
});

uploadRouter.get("/:path", (req, res) => {
  let {path} = req.params

  fs.stat(`public/termsOfReference/${path}`, (err, stats) => {
    if(err) res.send({err})
    if(stats) res.send({stats})
  });
});
