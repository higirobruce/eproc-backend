import { randomUUID } from "crypto";
import { Router } from "express";
import { PurchaseOrder } from "../classrepo/purchaseOrders";
import {
  getAllPOs,
  getPOByRequestId,
  getPOByTenderId,
  getPOByVendorId,
  savePO,
  savePOInB1,
  updatePo,
  updatePOStatus,
  updateProgress,
} from "../controllers/purchaseOrders";
import { getVendorByCompanyName, setTempFields } from "../controllers/users";
import { getBusinessPartnerByName } from "../services/b1";
import { generatePONumber } from "../services/purchaseOrders";
import { hashPassword } from "../services/users";
import { send } from "../utils/sendEmailNode";

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
    signatories,
    reqAttachmentDocId,
    rate
  } = req.body;


  let { B1Data_Assets, B1Data_NonAssets } = B1Data;

  let CardCode;

  await getBusinessPartnerByName(
    B1Data_Assets?.CardName || B1Data_NonAssets.CardName
  ).then(async (res) => {
    let bp = res.value;
    if (bp?.length >= 1) {
      CardCode = bp[0].CardCode;

      let b1Response_assets = B1Data_Assets ? await savePOInB1(
        CardCode,
        B1Data_Assets.DocType,
        B1Data_Assets.DocumentLines
      ): null

      let b1Response_nonAssets = B1Data_NonAssets ? await savePOInB1(
        CardCode,
        B1Data_NonAssets.DocType,
        B1Data_NonAssets.DocumentLines
      ): null

      if (b1Response_assets?.error || b1Response_nonAssets?.error) {
        response.status(201).send(b1Response_assets || b1Response_nonAssets);
      } else {
        let number = await generatePONumber();
        let refs = [];
        b1Response_assets && refs.push(b1Response_assets.DocNum)
        b1Response_nonAssets && refs.push(b1Response_nonAssets.DocNum)

        let tenderToCreate = new PurchaseOrder(
          number,
          vendor,
          tender,
          request,
          createdBy,
          sections,
          items,
          status,
          deliveryProgress,
          signatories,
          reqAttachmentDocId,
          refs,
          rate
        );

        let createdTender = await savePO(tenderToCreate);
        response.status(201).send({ createdTender });
      }
    } else {
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
  let { updates } = req.body;
  res.send(await updateProgress(id, updates));
});

poRouter.put("/:id", async (req, res) => {
  let { id } = req.params;
  let { newPo,pending,paritallySigned,signed } = req.body;
  let vendor = await getVendorByCompanyName(
    newPo?.signatories[newPo?.signatories?.length - 1]?.onBehalfOf
  );

  if (pending) {
    newPo.status = "pending-signature";
  }
  if (paritallySigned) {
    newPo.status = "partially-signed";
    // console.log(vendor);
    let _vendor = { ...vendor };
    let tempPass = randomUUID();

    _vendor.tempEmail =
      newPo?.signatories[newPo?.signatories?.length - 1]?.email;
    _vendor.tempPassword = hashPassword(tempPass);
    await setTempFields(vendor?._id, _vendor?.tempEmail, _vendor?.tempPassword);

    send(
      "from",
      _vendor.tempEmail,
      "Your Purchase Order has been signed",
      JSON.stringify({ email: _vendor.tempEmail, password: tempPass }),
      "",
      "externalSignaturePO"
    );
  }
  if (signed) {
    newPo.status = "signed";
  }

  let updated = await updatePo(id, newPo);

  res.status(200).send(updated);
});
