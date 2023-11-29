import multer, { diskStorage } from "multer";
import { Router } from "express";
import fs from "fs";
import { randomUUID } from "crypto";
import path from "path";
import { updateRequestFileName } from "../controllers/paymentRequests";

export let uploadRouter = Router();

uploadRouter.post("/termsOfReference/", (req, res) => {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "dist/public/termsOfReference");
    },

    filename: function (req, file, cb) {
      // cb(null, req.query.id+'.pdf');
      let fileName = randomUUID();
      cb(null, fileName + ".pdf");
    },
  });

  var upload = multer({ storage: storage }).array("files[]");
  // var upload = multer({ storage: storage }).array('file',100)
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500);
    } else if (err) {
      console.log(err);
      return res.status(500);
    }
    return res.status(200).send(req.files);
  });
});

uploadRouter.post("/rdbCerts/", (req, res) => {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "dist/public/rdbCerts");
    },
    filename: function (req, file, cb) {
      cb(null, req.query.id + ".pdf");
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

    console.log(req.file);
    return res.status(200).send(req.file);
  });
});

uploadRouter.post("/vatCerts/", (req, res) => {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "dist/public/vatCerts");
    },
    filename: function (req, file, cb) {
      cb(null, req.query.id + ".pdf");
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
      cb(null, req.query.id + ".pdf");
    },
  });

  console.log("Tender doc");
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
      cb(null, req.query.id + ".pdf");
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
      cb(null, req.query.id + ".pdf");
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

uploadRouter.post("/reqAttachments/", (req, res) => {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "dist/public/reqAttachments");
    },
    filename: function (req, file, cb) {
      cb(null, req.query.id + ".pdf");
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
  let { path } = req.params;

  fs.stat(`public/termsOfReference/${path}`, (err, stats) => {
    if (err) res.send({ err });
    if (stats) res.send({ stats });
  });
});

uploadRouter.post("/paymentRequests/", (req, res) => {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "dist/public/paymentRequests");
    },

    filename: function (req, file, cb) {
      // cb(null, req.query.id+'.pdf');
      let fileName = randomUUID();
      cb(null, file.originalname);
    },
  });

  var upload = multer({ storage: storage }).array("files[]");
  // var upload = multer({ storage: storage }).array('file',100)
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500);
    } else if (err) {
      console.log(err);
      return res.status(500);
    }

    return res.status(200).send(req.files);
  });
});

uploadRouter.post("/updatePaymentRequests/", (req, res) => {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "dist/public/paymentRequests");
    },
    filename: function (req, file, cb) {
      //update the request with the new file name
      updateRequestFileName(req.query.id+'.pdf', file.originalname).then(()=>{

        console.log('File name updated',req.query.id)
      })
      cb(null, file.originalname);
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

uploadRouter.get("/check/file/:folder/:name", function (req, res, next) {
  var folder = req.params.folder;
  let filePath = path.join(__dirname, "public/", folder);
  console.log(filePath);
  if (fs.existsSync(filePath)) {
    res.send(true);
  } else {
    res.send(false);
  }
});
