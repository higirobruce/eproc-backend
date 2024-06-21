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
  getPurReqLeadTime,
  getTransactionLogs,
} from "../controllers/requests";

import { UserModel } from "../models/users";
import { generateReqNumber } from "../services/requests";
import {
  generateUserNumber,
  hashPassword,
  validPassword,
} from "../services/users";
import { send } from "../utils/sendEmailNode";
import { logger } from "../utils/logger";

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

requetsRouter.get("/logs/:id", async (req, res) => {
  let { id } = req.params;
  res.send(await getTransactionLogs(id));
});

requetsRouter.get("/totalOverview", async (req, res) => {
  let { year, currency } = req.query;
  let resTotals = await getPurReqTotalAnalytics(year, currency);
  let resStatuses = await getPurReqStatusAnalytics(year, currency);
  let resSourcing = await getPurReqSourcingAnalytics(year, currency);
  let resServiceCat = await getPurReqServiceCat(year, currency);
  let leadTimeDays = await getPurReqLeadTime(year, currency);

  res.send({
    data: resTotals,
    statusData: resStatuses,
    sourcingData: resSourcing,
    serviceCatData: resServiceCat,
    leadTimeDays: leadTimeDays[0]?.days || 0,
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
  if (createdRequest) {
    logger.log({
      level: "info",
      message: `created purchase request`,
      meta: {
        doneBy: req.session?.user?.user,
        referenceId: `${createdRequest?._id}`,
        module: "requests",
        moduleMessage: `created by`,
      },
    });
  }
  res.status(201).send(createdRequest);
});

requetsRouter.post("/approve/:id", async (req, res) => {
  let { id } = req.params;
  let request = await approveRequest(id);
  logger.log({
    level: "info",
    message: `approved purchase request`,
    meta: {
      doneBy: req.session?.user?.user,
      referenceId: `${id}`,
      module: "requests",
      moduleMessage: `approved by`,
    },
  });
  res.send(request);
});

requetsRouter.post("/decline/:id", async (req, res) => {
  let { id } = req.params;
  let { reason, declinedBy } = req.body;

  let request = await declineRequest(id, reason, declinedBy);
  logger.log({
    level: "info",
    message: `declined purchase request`,
    meta: {
      doneBy: req.session?.user?.user,
      referenceId: `${id}`,
      module: "requests",
      moduleMessage: `declined by`,
    },
  });
  res.send(request);
});

requetsRouter.put("/status/:id", async (req, res) => {
  let { id } = req.params;
  let { status } = req.body;
  let request = await updateRequestStatus(id, status);

  logger.log({
    level: "info",
    message: `updapted purchase request`,
    meta: {
      doneBy: req.session?.user?.user,
      referenceId: `${id}`,
      module: "requests",
      moduleMessage: `updapted by`,
    },
  });
  res.send(request);
});

requetsRouter.put("/sourcingMethod/:id", async (req, res) => {
  let { id } = req.params;
  let { sourcingMethod } = req.body;
  let request = await updateRequestSourcingMethod(id, sourcingMethod);
  logger.log({
    level: "info",
    message: `updated sourcing method for purchase request`,
    meta: {
      doneBy: req.session?.user?.user,
      referenceId: `${id}`,
      module: "requests",
      moduleMessage: `sourcing method updated by`,
    },
  });
  res.send(request);
});

requetsRouter.put("/:id", async (req, res) => {
  let { id } = req.params;
  let { updates } = req.body;
  let request = await updateRequest(id, updates);
  logger.log({
    level: "info",
    message: `updated purchase request`,
    meta: {
      doneBy: req.session?.user?.user,
      referenceId: `${id}`,
      module: "requests",
      moduleMessage: `updated by`,
    },
  });
  res.send(request);
});
