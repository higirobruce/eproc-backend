import { Router } from "express";
import { PoLineItem } from "../classrepo/poLineItems";
import { Request } from "../classrepo/requests";
import { User } from "../classrepo/users";
import {
  approveRequest,
  declineRequest,
  getAllRequests,
  getAllRequestsByCreator,
  getAllRequestsByStatus,
  getReqCountsByBudgetStatus,
  getReqCountsByCategory,
  getReqCountsByDepartment,
  getReqCountsByStatus,
  getRequestById,
  getPurReqTotalAnalytics,
  saveRequest,
  updateRequest,
  updateRequestSourcingMethod,
  updateRequestStatus,
  getPurReqStatusAnalytics,
  getPurReqSourcingAnalytics,
  getPurReqServiceCat,
} from "../controllers/requests";

import { UserModel } from "../models/users";
import { generateReqNumber } from "../services/requests";
import {
  generateUserNumber,
  hashPassword,
  validPassword,
} from "../services/users";
import { send } from "../utils/sendEmailNode";

export const requetsRouter = Router();

requetsRouter.get("/", async (req, res) => {
  res.send(await getAllRequests());
});

requetsRouter.get("/countsByDep", async (req, res) => {
  res.send(await getReqCountsByDepartment());
});

requetsRouter.get("/countsByStatus", async (req, res) => {
  res.send(await getReqCountsByStatus());
});

requetsRouter.get("/countsByCat", async (req, res) => {
  res.send(await getReqCountsByCategory());
});

requetsRouter.get("/countsByBudgetStatus", async (req, res) => {
  res.send(await getReqCountsByBudgetStatus());
});

requetsRouter.get("/byStatus/:status/:id", async (req, res) => {
  // console.log('Requester',req.session.user)
  let user = await UserModel.findById(req?.session?.user?.user);
  let permissions = user?.permissions;

  let { status, id } = req.params;
  status === "all"
    ? res.send(await getAllRequestsByCreator(id, user, permissions))
    : res.send(await getAllRequestsByStatus(status, id, user, permissions));
});

requetsRouter.get("/byCreator/:createdBy", async (req, res) => {
  let { createdBy } = req.params;
  res.send(await getAllRequestsByCreator(createdBy));
});

requetsRouter.get("/totalOverview", async (req, res) => {
  let { year } = req.query;
  let resTotals = await getPurReqTotalAnalytics(year);
  let resStatuses = await getPurReqStatusAnalytics(year);
  let resSourcing = await getPurReqSourcingAnalytics(year);
  let resServiceCat = await getPurReqServiceCat(year);

  res.send({
    data: resTotals,
    statusData: resStatuses,
    sourcingData: resSourcing,
    serviceCatData: resServiceCat,
  });
});

requetsRouter.get("/:id", async (req, res) => {
  let { id } = req.params;
  res.send(await getRequestById(id));
});

requetsRouter.post("/", async (req, res) => {
  let {
    createdBy,
    items,
    dueDate,
    status,
    attachementUrls,
    description,
    serviceCategory,
    reason,
    declinedBy,
    budgeted,
    budgetLine,
    title,
    hod_approvalDate,
    hof_approvalDate,
    pm_approvalDate,
    rejectionDate,
    level1Approver,
    sourcingMethod,
    supportingDocs,
    currency,
  } = req.body;

  let number = await generateReqNumber();
  let itemObjects = items.map((i: PoLineItem) => {
    if (!i.currency) i.currency = "RWF";
    return i;
  });

  let requestToCreate = new Request(
    createdBy,
    itemObjects,
    dueDate,
    status,
    attachementUrls,
    number,
    description,
    serviceCategory,
    reason,
    declinedBy,
    budgeted,
    budgetLine,
    title,
    hod_approvalDate,
    hof_approvalDate,
    pm_approvalDate,
    rejectionDate,
    level1Approver,
    sourcingMethod,
    supportingDocs,
    currency
  );
  let createdRequest = await saveRequest(requestToCreate);
  res.status(201).send(createdRequest);
});

requetsRouter.post("/approve/:id", async (req, res) => {
  let { id } = req.params;
  res.send(await approveRequest(id));
});

requetsRouter.post("/decline/:id", async (req, res) => {
  let { id } = req.params;
  let { reason, declinedBy } = req.body;
  res.send(await declineRequest(id, reason, declinedBy));
});

requetsRouter.put("/status/:id", async (req, res) => {
  let { id } = req.params;
  let { status } = req.body;

  res.send(await updateRequestStatus(id, status));
});

requetsRouter.put("/sourcingMethod/:id", async (req, res) => {
  let { id } = req.params;
  let { sourcingMethod } = req.body;

  res.send(await updateRequestSourcingMethod(id, sourcingMethod));
});

requetsRouter.put("/:id", async (req, res) => {
  let { id } = req.params;
  let { updates } = req.body;
  res.send(await updateRequest(id, updates));
});
