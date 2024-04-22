import { Router } from "express";
import {
  getAllPaymentRequests,
  getAllRequestsByCreator,
  getAllRequestsByStatus,
  getPaymentRequestById,
  getPayReqSpendTrack,
  getPayReqSpendTrackTotals,
  getPayReqStatusAnalytics,
  getPayReqTotalAnalytics,
  getVendorEmail,
  savePaymentRequest,
  updateRequest,
} from "../controllers/paymentRequests";
import { UserModel } from "../models/users";
import { generatePaymentRequestNumber } from "../services/paymentRequests";
import { send } from "../utils/sendEmailNode";
import { saveJournalEntry } from "../services/b1";
import {
  getAllFinanceApprovers,
  getAllPaymentReviewers,
} from "../controllers/users";
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

    if (newPaymentRequest.approver) {
      //send notification
      let approver = await UserModel.findById(newPaymentRequest.approver);

      send(
        "from",
        approver?.email,
        "New payment request has been submitted.",
        JSON.stringify(newPaymentRequest),
        "html",
        "payment-request-review"
      );
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

paymentRequestRouter.get("/spendTracking", async (req, res) => {
  let { year } = req.query;
  let paidVsAll = await getPayReqSpendTrack(year);
  let totals = await getPayReqSpendTrackTotals(year);

  res.send({
    data: paidVsAll,
    totals,
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
      "New payment request has been submitted.",
      JSON.stringify(updatedRequest),
      "html",
      "payment-request-review"
    );
  }

  if (updatedRequest?.status == "reviewed") {
    // let vendor = await UserModel.findById(updatedRequest?.createdBy);
    let vendors = await getVendorEmail(updatedRequest?._id);
    vendors?.map((vendor) => {
      send(
        "from",
        vendor?.vendorEmail,
        "Update on Your Payment Request Review",
        JSON.stringify(updatedRequest),
        "html",
        "payment-request-update4"
      );
    });
  }

  if (updatedRequest?.status == "approved (hod)") {
    let initiator = await UserModel.findById(updatedRequest?.createdBy);

    let vendors = await getVendorEmail(updatedRequest?._id);
    vendors?.map((vendor) => {
      send(
        "from",
        vendor?.vendorEmail,
        "Update on Your Payment Request Approval",
        JSON.stringify(updatedRequest),
        "html",
        "payment-request-update1"
      );
    });
    send(
      "from",
      initiator?.email,
      "Update on Your Payment Request Approval",
      JSON.stringify(updatedRequest),
      "html",
      "payment-request-update1"
    );
    // let department = initiator?.department;
    let fDs = await getAllFinanceApprovers();
    fDs?.map((hod) => {
      send(
        "from",
        hod?.email,
        "Your Approval is needed on this payment request",
        JSON.stringify(updatedRequest),
        "html",
        "payment-request-approval"
      );
    });
  }

  if (updatedRequest?.status == "approved") {
    let initiator = await UserModel.findById(updatedRequest?.createdBy);
    send(
      "from",
      initiator?.email,
      "Update on Your Payment Request Approval",
      JSON.stringify(updatedRequest),
      "html",
      "payment-request-update2"
    );
    let vendors = await getVendorEmail(updatedRequest?._id);
    vendors?.map((vendor) => {
      send(
        "from",
        vendor?.vendorEmail,
        "Update on Your Payment Request Approval",
        JSON.stringify(updatedRequest),
        "html",
        "payment-request-update2"
      );
    });
  }

  if (updatedRequest?.status == "paid") {
    let initiator = await UserModel.findById(updatedRequest?.createdBy);

    send(
      "from",
      initiator?.email,
      "Your Payment request has been processed",
      JSON.stringify(updatedRequest),
      "html",
      "payment-request-update3"
    );
    let vendors = await getVendorEmail(updatedRequest?._id);
    vendors?.map((vendor) => {
      send(
        "from",
        vendor?.vendorEmail,
        "Update on Your Payment Request Approval",
        JSON.stringify(updatedRequest),
        "html",
        "payment-request-update3"
      );
    });
  }
  res.send(updates);
});
