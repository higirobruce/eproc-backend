import multer, { diskStorage } from "multer";
import { Router } from "express";
import fs from "fs";
import { randomUUID } from "crypto";
import path from "path";
import { updateRequestFileName } from "../controllers/paymentRequests";
import { logger } from "../utils/logger";
import moment from "moment";

export let uploadRouter = Router();

uploadRouter.post("/termsOfReferencesssss/", (req, res) => {
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

  var upload = multer({
    storage: storage,
    limits: { fileSize: 12 * 1024 * 1024 },
  }).array("files[]");
  // var upload = multer({ storage: storage,  limits: { fileSize: 12 * 1024 * 1024 }, }).array('file',100)
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500);
    } else if (err) {
      console.log(err);
      return res.status(500);
    }
    logger.log({
      level: "info",
      message: `Payment request File(s) ${JSON.stringify(
        req.files
      )} successfully created`,
    });
    return res.status(200).send(req.files);
  });
});

uploadRouter.post("/termsOfReference/", (req, res) => {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "dist/public/termsOfReference");
    },

    filename: function (req, file, cb) {
      let fileName = randomUUID();
      cb(
        null,
        (file.originalname
          .split(path.extname(file.originalname))[0]
          ?.split("_")[0] ||
          file.originalname.split(path.extname(file.originalname))[0]) +
          "_" +
          moment().format("DDMMMYY-hms") +
          path.extname(file.originalname)
      );
    },
  });

  var upload = multer({
    storage: storage,
    limits: { fileSize: 12 * 1024 * 1024 },
  }).array("files[]");
  // var upload = multer({ storage: storage,  limits: { fileSize: 12 * 1024 * 1024 }, }).array('file',100)
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500);
    } else if (err) {
      console.log(err);
      return res.status(500);
    }

    logger.log({
      level: "info",
      message: `Payment request File(s) ${JSON.stringify(
        req.files
      )} successfully created`,
    });
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

  var upload = multer({
    storage: storage,
    limits: { fileSize: 12 * 1024 * 1024 },
  }).single("file");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500);
    } else if (err) {
      console.log(err);
      return res.status(500);
    }
    logger.log({
      level: "info",
      message: `Payment request File(s) ${JSON.stringify(
        req.file
      )} successfully created`,
    });
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

  var upload = multer({
    storage: storage,
    limits: { fileSize: 12 * 1024 * 1024 },
  }).single("file");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500);
    } else if (err) {
      console.log(err);
      return res.status(500);
    }

    logger.log({
      level: "info",
      message: `Payment request File(s) ${JSON.stringify(
        req.file
      )} successfully created`,
    });

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
  var upload = multer({
    storage: storage,
    limits: { fileSize: 12 * 1024 * 1024 },
  }).single("file");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500);
    } else if (err) {
      console.log(err);
      return res.status(500);
    }
    logger.log({
      level: "info",
      message: `Payment request File(s) ${JSON.stringify(
        req.file
      )} successfully created`,
    });
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

  var upload = multer({
    storage: storage,
    limits: { fileSize: 12 * 1024 * 1024 },
  }).single("file");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500);
    } else if (err) {
      console.log(err);
      return res.status(500);
    }

    logger.log({
      level: "info",
      message: `Payment request File(s) ${JSON.stringify(
        req.file
      )} successfully created`,
    });
    return res.status(200).send(req.file);
  });
});

uploadRouter.post("/bidOtherDocs/", (req, res) => {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "dist/public/bidDocs");
    },

    filename: function (req, file, cb) {
      let fileName = randomUUID();
      cb(
        null,
        (file.originalname
          .split(path.extname(file.originalname))[0]
          ?.split("_")[0] ||
          file.originalname.split(path.extname(file.originalname))[0]) +
          "_" +
          moment().format("DDMMMYY-hms") +
          path.extname(file.originalname)
      );
    },
  });

  var upload = multer({
    storage: storage,
    limits: { fileSize: 12 * 1024 * 1024 },
  }).array("files[]");
  // var upload = multer({ storage: storage,  limits: { fileSize: 12 * 1024 * 1024 }, }).array('file',100)
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500);
    } else if (err) {
      console.log(err);
      return res.status(500);
    }

    logger.log({
      level: "info",
      message: `Payment request File(s) ${JSON.stringify(
        req.files
      )} successfully created`,
    });
    return res.status(200).send(req.files);
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

  var upload = multer({
    storage: storage,
    limits: { fileSize: 12 * 1024 * 1024 },
  }).single("file");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500);
    } else if (err) {
      console.log(err);
      return res.status(500);
    }
    logger.log({
      level: "info",
      message: `Payment request File(s) ${JSON.stringify(
        req.file
      )} successfully created`,
    });

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

  var upload = multer({
    storage: storage,
    limits: { fileSize: 12 * 1024 * 1024 },
  }).single("file");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500);
    } else if (err) {
      console.log(err);
      return res.status(500);
    }

    logger.log({
      level: "info",
      message: `Payment request File(s) ${JSON.stringify(
        req.file
      )} successfully created`,
    });
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
      let fileName = randomUUID();
      cb(
        null,
        (file.originalname
          .split(path.extname(file.originalname))[0]
          ?.split("_")[0] ||
          file.originalname.split(path.extname(file.originalname))[0]) +
          "_" +
          moment().format("DDMMMYY-hms") +
          path.extname(file.originalname)
      );
    },
  });

  var upload = multer({
    storage: storage,
    limits: { fileSize: 12 * 1024 * 1024 },
  }).array("files[]");
  // var upload = multer({ storage: storage,  limits: { fileSize: 12 * 1024 * 1024 }, }).array('file',100)
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500);
    } else if (err) {
      console.log(err);
      return res.status(500);
    }

    logger.log({
      level: "info",
      message: `Payment request File(s) ${JSON.stringify(
        req.files
      )} successfully created`,
    });
    return res.status(200).send(req.files);
  });
});

uploadRouter.post("/updatePaymentRequests/", async (req, res) => {
  let _file = "";
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "dist/public/paymentRequests");
    },

    filename: function (req, file, cb) {
      _file =
        file.originalname.split(path.extname(file.originalname))[0] +
        path.extname(file.originalname);
      let fileName = randomUUID();
      cb(
        null,
        file.originalname.split(path.extname(file.originalname))[0] +
          moment().format("DDMMMYY-hms") +
          path.extname(file.originalname)
      );
    },
  });

  var upload = multer({
    storage: storage,
    limits: { fileSize: 12 * 1024 * 1024 },
  }).single("file");
  // var upload = multer({ storage: storage,  limits: { fileSize: 12 * 1024 * 1024 }, }).array('file',100)
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500);
    } else if (err) {
      console.log(err);
      return res.status(500);
    }

    logger.log({
      level: "info",
      message: `Payment request File(s) ${JSON.stringify(
        req.file
      )} successfully created`,
    });

    await updateRequestFileName(
      req.query.id,
      _file,
      req.query.paymentProof === "true"
    );
    return res.status(200).send(req.file);
  });
});

// uploadRouter.post("/updatePaymentRequestsOld/", (req, res) => {
//   console.log(req.query.id);
//   var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "dist/public/paymentRequests");
//     },
//     filename: async function (req, file, cb) {
//       //update the request with the new file name

//       if (req.query.paymentProof === "false") {
//         return await updateRequestFileName(
//           req.query.id,
//           file.originalname.split(path.extname(file.originalname))[0] +
//             // "_" +
//             // Date.now() +
//             path.extname(file.originalname),
//           false,
//           cb
//         );
//       } else {
//         return await updateRequestFileName(
//           req.query.id,
//           file.originalname.split(path.extname(file.originalname))[0] +
//             // "_" +
//             // Date.now() +
//             path.extname(file.originalname),
//           true,
//           cb
//         );
//       }
//     },
//   });

//   var upload = multer({ storage: storage,  limits: { fileSize: 12 * 1024 * 1024 }, }).single("file");
//   upload(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//       console.log(err);
//       return res.status(500);
//     } else if (err) {
//       console.log(err);
//       return res.status(500);
//     }
//     logger.log({
//       level: "info",
//       message: `Payment request File(s) ${JSON.stringify(
//         req.file
//       )} successfully created`,
//     });
//     return res.status(200).send(req.file);
//   });
// });

uploadRouter.get("/check/file/:folder/:name", function (req, res, next) {
  var folder = req.params.folder;
  let filePath = path.join(__dirname, "public/", folder);
  if (fs.existsSync(filePath)) {
    res.send(true);
  } else {
    res.send(false);
  }
});
