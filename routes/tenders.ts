import { Router } from "express";
import { PoLineItem } from "../classrepo/poLineItems";
import { Request } from "../classrepo/requests";
import { Tender } from "../classrepo/tenders";
import { User } from "../classrepo/users";
import {
  approveRequest,
  declineRequest,
  getAllRequests,
  saveRequest,
  updateRequestStatus,
} from "../controllers/requests";
import {
  getAllTenders,
  getAllTendersByStatus,
  getClosedTenders,
  getOpenTenders,
  getTendCountsByCategory,
  getTendCountsByDepartment,
  getTendersById,
  getTendersByRequest,
  getTendersByServiceCategoryList,
  saveTender,
  updateTender,
  updateTenderStatus,
} from "../controllers/tenders";
import { generateReqNumber } from "../services/requests";
import { generateTenderNumber } from "../services/tenders";
import { send } from "../utils/sendEmailNode";

export const tenderRouter = Router();

tenderRouter.get("/", async (req, res) => {
  res.send(await getAllTenders());
});

tenderRouter.get("/byStatus/:status", async (req, res) => {
  let {status} = req.params;
  res.send(await getAllTendersByStatus(status));
});

tenderRouter.get("/byRequest/:requestId", async (req, res) => {
  let { requestId } = req.params;
  res.send(await getTendersByRequest(requestId));
});

tenderRouter.post("/byServiceCategories/", async (req, res) => {
  let { serviceCategories } = req.body;
  res.send(await getTendersByServiceCategoryList(serviceCategories));
});

tenderRouter.get("/countsByDep", async (req, res) => {
  res.send(await getTendCountsByDepartment());
});

tenderRouter.get("/countsByCat", async (req, res) => {
  res.send(await getTendCountsByCategory());
});

tenderRouter.get("/stats", async (req, res) => {
  let allTenders = await getAllTenders();
  let openTenders = await getOpenTenders();
  let closedTenders = await getClosedTenders();
  res.send({
    total: allTenders.length,
    open: openTenders.length,
    closed: closedTenders.length,
  });
});

tenderRouter.get("/:id", async (req, res) => {
  let {id} = req.params;
  res.send(await getTendersById(id));
});

tenderRouter.post("/", async (req, res) => {
  let {
    createdBy,
    items,
    dueDate,
    status,
    attachementUrls,
    submissionDeadLine,
    torsUrl,
    purchaseRequest,
    invitationSent,
    invitees,
    docId,
    evaluationReportId,
  } = req.body;
  let number = await generateTenderNumber();
  let itemObjects = items.map((i: PoLineItem) => {
    if (!i.currency) i.currency = "RWF";
    return i;
  });

  let tenderToCreate = new Tender(
    createdBy,
    itemObjects,
    dueDate,
    status,
    attachementUrls,
    number,
    submissionDeadLine,
    torsUrl,
    purchaseRequest,
    invitationSent,
    invitees,
    docId,
    evaluationReportId
  );

  let createdTender = await saveTender(tenderToCreate);
  res.status(201).send(createdTender);
});

tenderRouter.put("/:id", async (req, res) => {
  let { id } = req.params;
  let { newTender, sendInvitation } = req.body;

  let updatedTender = await updateTender(id, newTender);

  if (sendInvitation) {
    let invitees = newTender?.invitees;
    let inviteesEmails = invitees?.map((i: any) => {
     return i?.approver
    });

    send(
      "",
      inviteesEmails,
      "Bid Evaluation Invite",
      JSON.stringify(updatedTender),
      "",
      "bidEvaluationInvite"
    );
  }
  res.send(updatedTender);
});

tenderRouter.put("/status/:id", async (req, res) => {
  let { id } = req.params;
  let { status } = req.body;
  res.send(await updateTenderStatus(id, status));
});
