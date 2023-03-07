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
import { tenderPublished } from "../utils/notificationMessages";
import { send } from "../utils/sendEmailNode";

export const tenderRouter = Router();

tenderRouter.get("/", async (req, res) => {
  res.send(await getAllTenders());
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
    evaluationReportId
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
  try{
    let a = await send(
      "bhigiro@shapeherd.rw",
      "waroji2460@pubpng.com",
      tenderPublished(`${createdTender.number}`).subject,
      "Please check on the new Tender",
      tenderPublished(`${createdTender.number}`).body,
      "newTender"
    );
  }catch(err){
    console.log(err)
  }

  res.status(201).send(createdTender);
});

tenderRouter.put("/:id", async (req, res) => {
  let { id } = req.params;
  let { newTender, sendInvitation } = req.body;

  let updatedTender = await updateTender(id, newTender);

  if (sendInvitation)
    send(
      "bhigiro@shapeherd.rw",
      "waroji2460@pubpng.com",
      "Invitation in Tender awarding",
      `${JSON.stringify(updatedTender)}`,
      "",
      "invitation"
    );
  res.send(updatedTender);
});

tenderRouter.put("/status/:id", async (req, res) => {
  let { id } = req.params;
  let { status } = req.body;
  res.send(await updateTenderStatus(id, status));
});

