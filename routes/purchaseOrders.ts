import { Router } from "express";
import { PurchaseOrder } from "../classrepo/purchaseOrders";
import {
  getAllPOs,
  getPOByRequestId,
  getPOByTenderId,
  getPOByVendorId,
  savePO,
  savePOInB1,
  updatePOStatus,
  updateProgress,
} from "../controllers/purchaseOrders";
import { getBusinessPartnerByName } from "../services/b1";
import { generatePONumber } from "../services/purchaseOrders";

export const poRouter = Router();

poRouter.get("/", async (req, res) => {
  res.send(await getAllPOs());
});

poRouter.get("/byTenderId/:tenderId", async (req, res) => {
  let { tenderId } = req.params;
  res.send(await getPOByTenderId(tenderId));
});

poRouter.get("/byRequestId/:requestId", async (req, res) => {
  let { requestId } = req.params;
  res.send(await getPOByRequestId(requestId));
});

poRouter.get("/byVendorId/:vendorId", async (req, res) => {
  let { vendorId } = req.params;
  res.send(await getPOByVendorId(vendorId));
});

poRouter.post("/", async (req, response) => {
  let {
    vendor,
    tender,
    request,
    createdBy,
    sections,
    items,
    status,
    deliveryProgress,
    B1Data,
  } = req.body;

  let CardCode;
  await getBusinessPartnerByName(B1Data?.CardName).then(async (res) => {
    let bp = res.value;
    if (bp?.length >= 1) {
      CardCode = bp[0].CardCode;
      await savePOInB1(CardCode, B1Data.DocType, B1Data.DocumentLines);

      let number = await generatePONumber();

      let tenderToCreate = new PurchaseOrder(
        number,
        vendor,
        tender,
        request,
        createdBy,
        sections,
        items,
        status,
        deliveryProgress
      );

      let createdTender = await savePO(tenderToCreate);
      response.status(201).send(createdTender);
    } else {
      console.log(B1Data.CardName, "Business Partner not found!");
      response
        .status(500)
        .send({ error: true, message: "Business Partner not found!" });
    }
  });
});

poRouter.put("/status/:id", async (req, res) => {
  let { id } = req.params;
  let { status } = req.body;
  res.send(await updatePOStatus(id, status));
});

poRouter.put("/progress/:id", async (req, res) => {
  let { id } = req.params;
  let { deliveryProgress } = req.body;
  res.send(await updateProgress(id, deliveryProgress));
});
