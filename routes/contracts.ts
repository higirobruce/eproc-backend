import { Router } from "express";
import { Contract } from "../classrepo/contracts";
import { PurchaseOrder } from "../classrepo/purchaseOrders";
import {
  getAllContracts,
  getContractByTenderId,
  getContractByVendorId,
  saveContract,
} from "../controllers/contracts";
import {
  getPOByTenderId,
  getPOByVendorId,
  savePO,
  updatePOStatus,
  updateProgress,
} from "../controllers/purchaseOrders";
import { generateContractNumber } from "../services/contracts";

export const contractRouter = Router();

contractRouter.get("/", async (req, res) => {
  res.send(await getAllContracts());
});

contractRouter.get("/byTenderId/:tenderId", async (req, res) => {
  let { tenderId } = req.params;
  res.send(await getContractByTenderId(tenderId));
});

contractRouter.get("/byVendorId/:vendorId", async (req, res) => {
  let { vendorId } = req.params;
  res.send(await getContractByVendorId(vendorId));
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
    contractEndDate
  );

  let createdContract = await saveContract(contractToCreate);
  res.status(201).send(createdContract);
});
