import { Router } from "express";
import {
  awardSubmission,
  deselectOtherSubmissions,
  getAllBidSubmissions,
  getAllBidSubmissionsByTender,
  getAllBidSubmissionsByVendor,
  getAverageBidsPerTender,
  iSubmittedOnTender,
  rejectOtherSubmissions,
  rejectSubmission,
  saveBidSubmission,
  selectSubmission,
  updateSubmission,
  updateSubmissionStatus,
} from "../controllers/bidSubmissions";
import { BidSubmission } from "../classrepo/bidSubmissions";
import { generateBidSubmissionNumber } from "../services/bidSubmissions";
import { getVendorById, saveBankDetails } from "../controllers/users";
import { TenderModel } from "../models/tenders";
import { send } from "../utils/sendEmailNode";
import { logger } from "../utils/logger";

export const submissionsRouter = Router();

submissionsRouter.get("/", async (req, res) => {
  res.send(await getAllBidSubmissions());
});

submissionsRouter.get("/byTender/:tenderId", async (req, res) => {
  let { tenderId } = req.params;
  res.send(await getAllBidSubmissionsByTender(tenderId));
});

submissionsRouter.get("/byVendor/:vendorId", async (req, res) => {
  let { vendorId } = req.params;
  res.send(await getAllBidSubmissionsByVendor(vendorId));
});

submissionsRouter.get("/avgBidsPerTender", async (req, res) => {
  res.send(await getAverageBidsPerTender());
});

submissionsRouter.get("/submitted/:tenderId", async (req, res) => {
  let { tenderId } = req.params;
  let { vendorId } = req.query;
  res.send(await iSubmittedOnTender(tenderId, vendorId));
});

submissionsRouter.post("/", async (req, res) => {
  let {
    proposalUrls,
    deliveryDate,
    price,
    currency,
    warranty,
    discount,
    status,
    comment,
    createdBy,
    tender,
    warrantyDuration,
    bankName,
    bankAccountNumber,
    bankAccountName,
    proposalDocId,
    otherDocId,
    otherDocIds,
    deliveryTimeFrameDuration,
    deliveryTimeFrame,
  } = req.body;
  let number = await generateBidSubmissionNumber();

  let submission = new BidSubmission(
    proposalUrls,
    deliveryDate,
    price,
    currency,
    warranty,
    discount,
    status,
    comment,
    number,
    createdBy,
    tender,
    warrantyDuration,
    proposalDocId,
    otherDocId,
    otherDocIds,
    bankName,
    bankAccountNumber,
    bankAccountName,
    deliveryTimeFrameDuration,
    deliveryTimeFrame
  );

  // await saveBankDetails(createdBy, bankName, bankAccountNumber);

  let createdSubmission = await saveBidSubmission(submission);
  if (createdSubmission) {
    logger.log({
      level: "info",
      message: `submitted bid for the tender`,
      meta: {
        doneBy: req.session?.user?.user,
        messageModule: `bid submitted`,
        referenceId: `${createdSubmission?._id}`,
        module: 'tenders'
      },
    });
  }
  res.status(201).send(createdSubmission);
});

submissionsRouter.post("/select/:id", async (req, res) => {
  let { id } = req.params;
  let { tenderId } = req.query;
  let { evaluationReportId } = req.body;

  let tender = await TenderModel.findByIdAndUpdate(tenderId, {
    $set: { evaluationReportId },
  });
  selectSubmission(id).then(async (r) => {
    // logger.log({
    //   level: "info",
    //   message: `Bid ${id} selected for the tender ${tenderId}`,
    // });

    logger.log({
      level: "info",
      message: `selected bid for the tender`,
      meta: {
        doneBy: req.session?.user?.user,
        messageModule: `bid selected`,
        referenceId: `${tenderId}`,
        module: 'tenders'
      },
    });
    await deselectOtherSubmissions(tenderId);

    //Send Bid Selection confirmation
    let invitees = tender?.invitees;
    let inviteesEmails = invitees?.map((i: any) => {
      return i?.approver;
    });
    if (invitees) {
      send(
        "",
        inviteesEmails,
        "Bid Selection confirmation",
        JSON.stringify(tender),
        "",
        "bidSelectionConfirmation"
      );
    }

    res.send(r);
  });
});

submissionsRouter.post("/award/:id", async (req, res) => {
  let { id } = req.params;
  let { tenderId } = req.query;
  awardSubmission(id).then(async (r) => {
    // logger.log({
    //   level: "info",
    //   message: `Bid ${id} was awarded for the tender ${tenderId}`,
    // });

    logger.log({
      level: "info",
      message: `awarded a bid for the tender`,
      meta: {
        doneBy: req.session?.user?.user,
        messageModule:`bid awarded`,
        referenceId: `${tenderId}`,
        module: 'tenders'
      },
    });
    await rejectOtherSubmissions(tenderId);
    res.send(r);
  });
});

submissionsRouter.post("/reject/:id", async (req, res) => {
  let { id } = req.params;

  let rejected = await rejectSubmission(id)
  logger.log({
    level: "info",
    message: `rejected a bid for the tender`,
    meta: {
      doneBy: req.session?.user?.user,
      messageModule:`bid rejected`,
      referenceId: `${id}`,
      module: 'tenders'
    },
  });
  res.send(rejected);
});

submissionsRouter.put("/status/:id", async (req, res) => {
  let { id } = req.params;
  let { status } = req.body;
  logger.log({
    level: "info",
    message: `rejected a bid for the tender`,
    meta: {
      doneBy: req.session?.user?.user,
      messageModule:`bid rejected`,
      referenceId: `${id}`,
      module: 'tenders'
    },
  });
  res.send(await updateSubmissionStatus(id, status));
});

submissionsRouter.put("/:id", async (req, res) => {
  let { id } = req.params;
  let {
    proposalUrls,
    deliveryDate,
    price,
    currency,
    warranty,
    discount,
    status,
    comment,
    createdBy,
    tender,
    warrantyDuration,
    bankName,
    bankAccountNumber,
    bankAccountName,
    proposalDocId,
    otherDocId,
    otherDocIds,
    deliveryTimeFrameDuration,
    deliveryTimeFrame,
  } = req.body;
  res.send(
    await updateSubmission(
      id,
      proposalUrls,
      deliveryDate,
      price,
      currency,
      warranty,
      discount,
      status,
      comment,
      createdBy,
      tender,
      warrantyDuration,
      bankName,
      bankAccountNumber,
      bankAccountName,
      proposalDocId,
      otherDocId,
      otherDocIds,
      deliveryTimeFrameDuration,
      deliveryTimeFrame
    )

    
  );
});
