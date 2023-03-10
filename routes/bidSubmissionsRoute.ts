import { Router } from "express";
import {
  awardSubmission,
  deselectOtherSubmissions,
  getAllBidSubmissions,
  getAllBidSubmissionsByTender,
  getAllBidSubmissionsByVendor,
  iSubmittedOnTender,
  rejectOtherSubmissions,
  rejectSubmission,
  saveBidSubmission,
  selectSubmission,
  updateSubmissionStatus,
} from "../controllers/bidSubmissions";
import { BidSubmission } from "../classrepo/bidSubmissions";
import { generateBidSubmissionNumber } from "../services/bidSubmissions";
import { getVendorById, saveBankDetails } from "../controllers/users";
import { TenderModel } from "../models/tenders";
import { send } from "../utils/sendEmailNode";

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
    proposalDocId,
    otherDocId,
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
    bankName,
    bankAccountNumber
  );

  // await saveBankDetails(createdBy, bankName, bankAccountNumber);

  let createdSubmission = await saveBidSubmission(submission);
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
    await deselectOtherSubmissions(tenderId);

    //Send Bid Selection confirmation
    let invitees = tender?.invitees;
    let inviteesEmails = invitees?.map((i: any) => {
      return i?.approver;
    });
    send(
      "",
      inviteesEmails,
      "Bid Selection confirmation",
      JSON.stringify(tender),
      "",
      "bidSelectionConfirmation"
    );
    
    res.send(r);
  });
});

submissionsRouter.post("/award/:id", async (req, res) => {
  let { id } = req.params;
  let { tenderId } = req.query;
  awardSubmission(id).then(async (r) => {
    await rejectOtherSubmissions(tenderId);
    res.send(r);
  });
});

submissionsRouter.post("/reject/:id", async (req, res) => {
  let { id } = req.params;
  res.send(await rejectSubmission(id));
});

submissionsRouter.put("/status/:id", async (req, res) => {
  let { id } = req.params;
  let { status } = req.body;
  res.send(await updateSubmissionStatus(id, status));
});
