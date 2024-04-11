import { Router } from "express";
import {
  getAllPaymentRequests,
  getAllRequestsByCreator,
  getAllRequestsByStatus,
  getPaymentRequestById,
  getPayReqStatusAnalytics,
  getPayReqTotalAnalytics,
  savePaymentRequest,
  updateRequest,
} from "../controllers/paymentRequests";
import { UserModel } from "../models/users";
import { generatePaymentRequestNumber } from "../services/paymentRequests";
import { send } from "../utils/sendEmailNode";
import { saveJournalEntry } from "../services/b1";
import { getAllPaymentReviewers } from "../controllers/users";
export const paymentRequestRouter = Router();

paymentRequestRouter.get("/", async (req, res) => {
  try {
    let paymentRequests = await getAllPaymentRequests();

    res.status(200).send(paymentRequests);
  } catch (err) {
    res.status(500).send({ error: `${err}` });
  }
});

paymentRequestRouter.post("/", async (req, res) => {
  let number = await generatePaymentRequestNumber();
  req.body.number = number;
  try {
    let newPaymentRequest = await savePaymentRequest(req.body);

    if (newPaymentRequest?.category == "external") {
      let reviewers = await getAllPaymentReviewers();
      reviewers?.map((r) => {
        send(
          "from",
          r?.email,
          "New payment request has been submitted.",
          JSON.stringify(newPaymentRequest),
          "html",
          "payment-request-submitted"
        );
      });
    }

    res.status(201).send(newPaymentRequest);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: `${err}` });
  }
});

paymentRequestRouter.get("/byStatus/:status/:id", async (req, res) => {
  let { status, id } = req.params;
  status === "all"
    ? res.send(await getAllRequestsByCreator(id))
    : res.send(await getAllRequestsByStatus(status, id));
});

paymentRequestRouter.get("/totalOverview", async (req, res) => {
  let { year } = req.query;
  let resTotals = await getPayReqTotalAnalytics(year);
  let resStatusData = await getPayReqStatusAnalytics(year);

  res.send({
    data: resTotals,
    statusData: resStatusData,
     
  });
});

paymentRequestRouter.get("/:id", async (req, res) => {
  let { id } = req.params;
  res.send(await getPaymentRequestById(id));
});

paymentRequestRouter.put("/:id", async (req, res) => {
  let { id } = req.params;
  let { updates } = req.body;
  // if (updates?.journalEntry) {
  //   let { Memo, ReferenceDate, JournalEntryLines } = updates?.journalEntry;
  //   saveJournalEntry(Memo, ReferenceDate, JournalEntryLines)
  //   .then(async (response) => {
  //     updates.journalEntry = response?.JdtNum;
  //     updates.journalEntryLines = JournalEntryLines;

  //     console.log(updates)
  //       if (response.error) {
  //         console.log(response);
  //         res.send({
  //           error: true,
  //           message: response?.error?.message.value,
  //         });
  //       } else {
  //         let updatedRequest = response?.JdtNum
  //           ? await updateRequest(id, updates)
  //           : updates;
  //         if (updates.notifyApprover && updates.approver) {
  //           //send notification
  //           let approver = await UserModel.findById(updates.approver);

  //           send(
  //             "from",
  //             approver?.email,
  //             "Your Approval is needed",
  //             JSON.stringify(updatedRequest),
  //             "html",
  //             "payment-request-approval"
  //           );
  //         }

  //         res.send(updates);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       res.status(500).send({
  //         error: true,
  //         message: `Error: ${err}`,
  //       });
  //     });
  // } else {
  //   let updatedRequest = await updateRequest(id, updates);
  //   if (updates.notifyApprover && updates.approver) {
  //     //send notification
  //     let approver = await UserModel.findById(updates.approver);

  //     send(
  //       "from",
  //       approver?.email,
  //       "Your Approval is needed",
  //       JSON.stringify(updatedRequest),
  //       "html",
  //       "payment-request-approval"
  //     );
  //   }
  //   res.send(updates);
  // }
  let updatedRequest = await updateRequest(id, updates);

  if (updates.notifyApprover && updates.approver) {
    //send notification
    let approver = await UserModel.findById(updates.approver);

    send(
      "from",
      approver?.email,
      "Your Approval is needed",
      JSON.stringify(updatedRequest),
      "html",
      "payment-request-approval"
    );
  }
  res.send(updates);
});
