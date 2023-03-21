import { randomUUID } from "crypto";
import { Router } from "express";
import { Contract } from "../classrepo/contracts";
import { PurchaseOrder } from "../classrepo/purchaseOrders";
import {
  getAllContracts,
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
import { generateContractNumber } from "../services/contracts";
import { hashPassword } from "../services/users";
import { send } from "../utils/sendEmailNode";

export const contractRouter = Router();

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
  res.send(await getContractByVendorId(vendorId, status));
});

contractRouter.get("/byStatus/:status", async (req, res) => {
  let { status } = req.params;
  res.send(await getContractByStatus(status));
});

contractRouter.post("/", async (req, res) => {
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
  } = req.body;

  let number = await generateContractNumber();

  let contractToCreate = new Contract(
    tender,
    number,
    vendor,
    request,
    createdBy,
    sections,
    status,
    deliveryProgress,
    contractStartDate,
    contractEndDate,
    signatories,
    reqAttachmentDocId
  );

  let createdContract = await saveContract(contractToCreate);
  res.status(201).send(createdContract);
});

contractRouter.put("/:id", async (req, res) => {
  let { id } = req.params;
  let { newContract, pending, paritallySigned, signed } = req.body;
  let vendor = await getVendorByCompanyName(
    newContract?.signatories[newContract?.signatories?.length - 1]?.onBehalfOf
  );

  if (pending) {
    newContract.status = "pending-signature";
  }
  if (paritallySigned) {
    newContract.status = "partially-signed";
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
      JSON.stringify({ email: _vendor.tempEmail, password: tempPass }),
      "",
      "externalSignature"
    );
  }
  if (signed) {
    newContract.status = "signed";
  }
  let updated = await updateContract(id, newContract);

  res.status(200).send(updated);
});
