import multer, { diskStorage } from "multer";
import { Router } from "express";

export let uploadRouter = Router();

uploadRouter.post("/termsOfReference", (req, res) => {

    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "public/termsOfReference");
      },
      filename: function (req, file, cb) {
        cb(null, "TOR " + "-" + file.originalname);
      },
    });

  var upload = multer({ storage: storage }).single("file");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
        console.log(err)
      return res.status(500);
    } else if (err) {
        console.log(err)
      return res.status(500);
    }
    return res.status(200).send(req.file);
  });
});
