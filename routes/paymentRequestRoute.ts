import { Router } from "express";
import {
  getAllPaymentRequests,
  getAllRequestsByCreator,
  getAllRequestsByStatus,
  getDepartmentExpenseTracking,
  getPaymentRequestById,
  getPayReqExpenseTrack,
  getPayReqExpenseTrackTotals,
  getPayReqLeadTime,
  getPayReqSpendTrack,
  getPayReqSpendTrackBudgets,
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
import { logger } from "../utils/logger";
import { getTransactionLogs } from "../controllers/requests";
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

    logger.log({
      level: "info",
      message: `created ${newPaymentRequest?._id}`,
      meta: {
        doneBy: req.session?.user?.user,
        referenceId: newPaymentRequest?._id.toString(),
        module: "payment-requests",
        moduleMessage: `created by ${req.session?.user?.user}`,
      },
    });

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
  let { year, currency } = req.query;
  let resTotals = await getPayReqTotalAnalytics(year, currency);
  let resStatusData = await getPayReqStatusAnalytics(year, currency);
  let leadTime = await getPayReqLeadTime(year, currency);

  res.send({
    data: resTotals,
    statusData: resStatusData,
    leadTimeDays: leadTime[0]?.days || 0,
  });
});

paymentRequestRouter.get("/spendTracking", async (req, res) => {
  let { year, currency } = req.query;
  let paidVsAll = await getPayReqSpendTrack(year, currency);
  let totals = await getPayReqSpendTrackTotals(year, currency);
  let budgets = await getPayReqSpendTrackBudgets(year, currency);

  res.send({
    data: paidVsAll,
    totals,
    budgetData: [
      { name: "Budgeted", value: budgets[0]?.total_budgeted },
      { name: "Non-budgeted", value: budgets[0]?.total_unbudgeted },
    ],
  });
});

paymentRequestRouter.get("/expensePlanning", async (req, res) => {
  let { year, currency } = req.query;
  let interalVSExternal = await getPayReqExpenseTrack(year, currency);
  let totals = await getPayReqExpenseTrackTotals(year, currency);
  let dapartmentalExpenses = await getDepartmentExpenseTracking(year, currency);

  res.send({
    data: interalVSExternal,
    totals,
    dapartmentalExpenses,
  });
});

paymentRequestRouter.get("/logs/:id", async (req, res) => {
  let { id } = req.params;
  res.send(await getTransactionLogs(id));
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

    logger.log({
      level: "info",
      message: `reviewed payment request`,
      meta: {
        doneBy: req.session?.user?.user,
        referenceId: updatedRequest?._id.toString(),
        module: "payment-requests",
        moduleMessage: `reviewed by`,
      },
    });
  } else

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

    logger.log({
      level: "info",
      message: `approved payment request`,
      meta: {
        doneBy: req.session?.user?.user,
        referenceId: updatedRequest?._id.toString(),
        module: "payment-requests",
        moduleMessage: `approved by`,
      },
    });
  } else

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
    logger.log({
      level: "info",
      message: `approved payment request`,
      meta: {
        doneBy: req.session?.user?.user,
        referenceId: updatedRequest?._id.toString(),
        module: "payment-requests",
        moduleMessage: `approved by`,
      },
    });
  } else

  if (updatedRequest?.status == "withdrawn") {
    let initiator = await UserModel.findById(updatedRequest?.createdBy);
  
    logger.log({
      level: "info",
      message: `withdrawn payment request`,
      meta: {
        doneBy: req.session?.user?.user,
        referenceId: updatedRequest?._id.toString(),
        module: "payment-requests",
        moduleMessage: `withdrawn by`,
      },
    });
  } else

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
    logger.log({
      level: "info",
      message: `paid payment request`,
      meta: {
        doneBy: req.session?.user?.user,
        referenceId: updatedRequest?._id.toString(),
        module: "payment-requests",
        moduleMessage: `paid by`,
      },
    });
  } else {
    logger.log({
      level: "info",
      message: `updated payment request`,
      meta: {
        doneBy: req.session?.user?.user,
        referenceId: updatedRequest?._id.toString(),
        module: "payment-requests",
        moduleMessage: `updated by`,
      },
    });
  }

  res.send(updates);
});
