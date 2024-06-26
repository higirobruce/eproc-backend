import { randomUUID } from "crypto";
import { Router, NextFunction, Request, Response } from "express";
import { Contract } from "../classrepo/contracts";
import { PurchaseOrder } from "../classrepo/purchaseOrders";
import {
  getAllContracts,
  getContractById,
  getContractByRequestId,
  getContractByStatus,
  getContractByTenderId,
  getContractByVendorId,
  saveContract,
  updateContract,
} from "../controllers/contracts";
import {
  getPOByTenderId,
  getPOByVendorId,
  savePO,
  updatePOStatus,
  updateProgress,
} from "../controllers/purchaseOrders";
import {
  getVendorByCompanyName,
  setTempFields,
  updateUser,
} from "../controllers/users";
import { UserModel } from "../models/users";
import { generateContractNumber } from "../services/contracts";
import { hashPassword } from "../services/users";
import { logger } from "../utils/logger";
import { send } from "../utils/sendEmailNode";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export let SALT =
  process.env.TOKEN_SALT || "968d8b95-72cd-4470-b13e-1017138d32cf";
export const contractRouter = Router();

let ensureUserAuthorized = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.token;
    if (!token) {
      res.status(401).send("Unauthorized");
    } else {
      let user = jwt.verify(token as string, SALT);
      req.session.user = user;

      next();
    }
  } catch (err) {
    res.status(401).send("Please send a valid access token in the header");
  }
};

contractRouter.get("/", async (req, res) => {
  res.send(await getAllContracts());
});

contractRouter.get("/byTenderId/:tenderId", async (req, res) => {
  let { tenderId } = req.params;
  res.send(await getContractByTenderId(tenderId));
});

contractRouter.get("/byRequestId/:requestId", async (req, res) => {
  let { requestId } = req.params;
  res.send(await getContractByRequestId(requestId));
});

contractRouter.get("/byVendorId/:vendorId/:status", async (req, res) => {
  let { vendorId, status } = req.params;
  res.send(await getContractByVendorId(vendorId, status, req));
});

contractRouter.get("/byStatus/:status", async (req, res) => {
  let { status } = req.params;
  res.send(await getContractByStatus(req, status));
});

contractRouter.get("/:id", async (req, res) => {
  let { id } = req.params;
  res.send(await getContractById(id));
});

contractRouter.post("/", ensureUserAuthorized, async (req, res) => {
  let {
    vendor,
    tender,
    request,
    createdBy,
    sections,
    status,
    deliveryProgress,
    contractStartDate,
    contractEndDate,
    signatories,
    reqAttachmentDocId,
    title,
    receiverPartyLabel,
    senderPartyLabel,
  } = req.body;

  console.log({
    title,
    receiverPartyLabel,
    senderPartyLabel,
  });

  let number = await generateContractNumber();

  let contractToCreate = new Contract(
    tender,
    number,
    vendor,
    request,
    createdBy,
    sections,
    status,
    title,
    senderPartyLabel,
    receiverPartyLabel,
    deliveryProgress,
    contractStartDate,
    contractEndDate,
    signatories,
    reqAttachmentDocId
  );

  let createdContract = await saveContract(contractToCreate);
  if (status == "legal-review") {
    send(
      "from",
      (await getLegalOfficers()) as string | string[],
      "Your Review is needed",
      JSON.stringify({
        docId: createdContract?._id,
        docType: "contracts",
        docNumber: createdContract?.number,
      }),
      "",
      "contractReview"
    );
    // logger.log({
    //   level: "info",
    //   message: `Contract ${createdContract?._id} successfully created`,
    // });
  }

  // logger.log({
  //   level: "info",
  //   message: `Contract ${createdContract?._id} successfully created`,
  //   meta: {
  //     doneBy: new mongoose.Types.ObjectId(req.session?.user?.user),
  //     payload: req.body,
  //   },
  // });

  logger.log({
    level: "info",
    message: `created contract`,
    meta: {
      doneBy: req.session?.user?.user,
      referenceId: `${createdContract?._id}`,
      module: "contracts",
    },
  });
  res.status(201).send(createdContract);
});

contractRouter.put("/:id", ensureUserAuthorized, async (req, res) => {
  let { id } = req.params;
  let {
    newContract,
    pending,
    paritallySigned,
    signed,
    previousStatus,
    signingIndex,
  } = req.body;
  let logOptions = {};
  let vendor = await getVendorByCompanyName(
    newContract?.signatories[newContract?.signatories?.length - 1]?.onBehalfOf
  );

  let nextSignatory =
    newContract?.signatories.length >= signingIndex + 1
      ? newContract.signatories[signingIndex + 1]?.email
      : null;

  if (previousStatus == "draft") {
    send(
      "from",
      newContract?.signatories[0]?.email,
      "Your review is needed",
      JSON.stringify({
        docId: newContract?._id,
        docType: "contracts",
        docNumber: newContract?.number,
      }),
      "",
      "contractReview"
    );
  }

  if (previousStatus == "legal-review") {
    send(
      "from",
      newContract?.signatories[0]?.email,
      "Your Signature is needed",
      JSON.stringify({ docId: newContract?._id, docType: "contracts" }),
      "",
      "internalSignature"
    );
  }

  if (pending) {
    newContract.status = "pending-signature";
    logOptions = {
      level: "info",
      message: `Contract ${id} set to pending-singature status`,
    };
  }
  if (paritallySigned) {
    newContract.status = "partially-signed";
    logOptions = {
      level: "info",
      message: `Contract ${id} set to partially-signed status`,
    };
    // console.log(vendor);
    let _vendor = { ...vendor };
    let tempPass = randomUUID();

    _vendor.tempEmail =
      newContract?.signatories[newContract?.signatories?.length - 1]?.email;
    _vendor.tempPassword = hashPassword(tempPass);
    await setTempFields(vendor?._id, _vendor?.tempEmail, _vendor?.tempPassword);
    send(
      "from",
      _vendor.tempEmail,
      "Your contract has been signed",
      JSON.stringify({
        email: _vendor.tempEmail,
        password: tempPass,
        docType: "contracts",
        docId: newContract?._id,
      }),
      "",
      "externalSignature"
    );
  }
  if (signed) {
    newContract.status = "signed";
    logOptions = {
      level: "info",
      message: `Contract ${id} set to signed status`,
    };
  }

  if (nextSignatory && !paritallySigned) {
    send(
      "from",
      nextSignatory,
      "Your Signature is needed",
      JSON.stringify({ docId: newContract?._id, docType: "contracts" }),
      "",
      "internalSignature"
    );
  }

  let updated = await updateContract(id, newContract);

  if (updated) {
    logger.log({
      level: "info",
      message: `updated contract`,
      meta: {
        doneBy: req.session?.user?.user,
        referenceId: `${id}`,
        module: "contracts",
      },
    });
  }

  res.status(200).send(updated);
});

export async function getLegalOfficers() {
  try {
    let legalOfficers = await UserModel.find(
      { "permissions.canApproveAsLegal": true },
      { email: 1 }
    );
    return legalOfficers.map((l) => {
      return l.email;
    });
  } catch (err) {
    return [""];
  }
}
