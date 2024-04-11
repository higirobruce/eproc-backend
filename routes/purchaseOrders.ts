import { randomUUID } from "crypto";
import { Router, NextFunction, Request, Response } from "express";
import { PurchaseOrder } from "../classrepo/purchaseOrders";
import {
  getAllPOs,
  getPOById,
  getPOByRequestId,
  getPOByTenderId,
  getPOByVendorId,
  savePO,
  savePOInB1,
  updateB1Po,
  updatePo,
  updatePOStatus,
  updateProgress,
  getAllPOsByStatus,
  getPOPaymentRequests,
  getPOPaidRequests,
  getPoTotalAnalytics,
} from "../controllers/purchaseOrders";
import { getVendorByCompanyName, setTempFields } from "../controllers/users";
import { getBusinessPartnerByName } from "../services/b1";
import { generatePONumber } from "../services/purchaseOrders";
import { hashPassword } from "../services/users";
import { send } from "../utils/sendEmailNode";
import { logger } from "../utils/logger";
import { RequestModel } from "../models/requests";

export const poRouter = Router();

poRouter.get("/", async (req, res) => {
  res.send(await getAllPOs(req));
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
  let { status } = req.query;
  res.send(await getPOByVendorId(vendorId, status as String));
});

poRouter.get("/byStatus/:status", async (req, res) => {
  let { status } = req.params;
  status === "all"
    ? res.send(await getAllPOs())
    : res.send(await getAllPOsByStatus(status));
});

poRouter.get("/paymentProgress/:id", async (req, res) => {
  let { id } = req.params;
  res.send(await getPOPaymentRequests(id));
});

poRouter.get("/paymentsDone/:id", async (req, res) => {
  let { id } = req.params;
  res.send(await getPOPaidRequests(id));
});

poRouter.get("/totalOverview", async (req, res) => {
  let { year } = req.query;
  let totals = await getPoTotalAnalytics(year);

  res.send({
    data: totals,
  });
});

poRouter.get("/:id", async (req, res) => {
  let { id } = req.params;
  res.send(await getPOById(id));
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
    rate,
    rateComment,
  } = req.body;

  let { B1Data_Assets, B1Data_NonAssets } = B1Data;

  let CardCode;
  await getBusinessPartnerByName(
    B1Data_Assets?.CardName || B1Data_NonAssets.CardName
  )
    .then(async (res) => {
      let bp = res.value;

      if (bp?.length >= 1) {
        CardCode = bp[0].CardCode;

        let b1Response_assets = B1Data_Assets
          ? await savePOInB1(
              CardCode,
              B1Data_Assets.DocType,
              B1Data_Assets.DocumentLines,
              B1Data_Assets.DocCurrency
            )
          : null;

        let b1Response_nonAssets = B1Data_NonAssets
          ? await savePOInB1(
              CardCode,
              B1Data_NonAssets.DocType,
              B1Data_NonAssets.DocumentLines,
              B1Data_NonAssets.DocCurrency
            )
          : null;

        if (b1Response_assets?.error || b1Response_nonAssets?.error) {
          response.status(500).send(b1Response_assets || b1Response_nonAssets);
        } else {
          let number = await generatePONumber();
          let refs: any[] = [];
          b1Response_assets && refs.push(b1Response_assets.DocNum);
          b1Response_nonAssets && refs.push(b1Response_nonAssets.DocNum);

          let poToCreate = new PurchaseOrder(
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
            rate,
            rateComment
          );

          let createdPO = await savePO(poToCreate);

          if (createdPO) {
            send(
              "from",
              signatories[0]?.email,
              "Your Signature is needed",
              JSON.stringify({
                docId: createdPO?._id,
                docType: "purchase-orders",
              }),
              "",
              "internalSignature"
            );

            logger.log({
              level: "info",
              message: `Purchase Order ${createdPO?._id} successfully created`,
              meta: {
                doneBy: req.session?.user,
                payload: req.body,
              },
            });

            if (refs?.length >= 1) {
              refs.forEach(async (r) => {
                await updateB1Po(r, {
                  Comments: `Refer to PO number ${createdPO?.number} in the e-procurement tool.`,
                });
              });
            }
          }

          response.status(201).send({ createdTender: createdPO });
        }
      } else {
        response
          .status(500)
          .send({ error: true, message: "Business Partner not found!" });
      }
    })
    .catch((err) => {
      logger.log({
        level: "error",
        message: `Creating a Purchase Order failed. Error: ${err}`,
        meta: {
          doneBy: req.session?.user,
          payload: req.body,
        },
      });
      console.log(err);
    });
});

poRouter.put("/status/:id", async (req, res) => {
  let { id } = req.params;
  let { status } = req.body;
  let updatedPO = await updatePOStatus(id, status);

  if (!updatedPO.error) {
    logger.log({
      level: "info",
      message: `Purchase Order ${id} successfully updated`,
      meta: {
        doneBy: req.session?.user,
        payload: req.body,
      },
    });
  } else {
    logger.log({
      level: "error",
      message: `Updating Purchase Order ${id} failed. ${updatedPO?.errorMessage}`,
      meta: {
        doneBy: req.session?.user,
        payload: req.body,
      },
    });
  }
  res.send(updatedPO);
});

poRouter.put("/progress/:id", async (req, res) => {
  let { id } = req.params;
  let { updates } = req.body;
  res.send(await updateProgress(id, updates));
});

poRouter.put("/:id", async (req, res) => {
  let { id } = req.params;
  let { newPo, pending, paritallySigned, signed, signingIndex } = req.body;
  let vendor = await getVendorByCompanyName(
    newPo?.signatories[newPo?.signatories?.length - 1]?.onBehalfOf
  );

  let nextSignatory =
    newPo?.signatories.length >= signingIndex + 2
      ? newPo.signatories[signingIndex + 1]?.email
      : null;

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
      JSON.stringify({
        email: _vendor.tempEmail,
        password: tempPass,
        docType: "purchase-orders",
        docId: newPo?._id,
      }),
      "",
      "externalSignature"
    );
  }
  if (signed) {
    newPo.status = "signed";
  }

  let updated = await updatePo(id, newPo);

  if (nextSignatory && !paritallySigned) {
    send(
      "from",
      nextSignatory,
      "Your Signature is needed",
      JSON.stringify({ docId: newPo?._id, docType: "purchase-orders" }),
      "",
      "internalSignature"
    );
  }

  if (updated) {
    logger.log({
      level: "info",
      message: `Purchase Order ${id} successfully updated`,
      meta: {
        doneBy: req.session?.user,
        payload: req.body,
      },
    });
  } else {
    logger.log({
      level: "error",
      message: `Updating Purchase Order ${id} failed`,
      meta: {
        doneBy: req.session?.user,
        payload: req.body,
      },
    });
  }

  res.status(200).send(updated);
});
