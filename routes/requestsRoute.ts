import { Router } from "express";
import { PoLineItem } from "../classrepo/poLineItems";
import { Request } from "../classrepo/requests";
import { User } from "../classrepo/users";
import {
  approveRequest,
  declineRequest,
  getAllRequests,
  getAllRequestsByCreator,
  getReqCountsByDepartment,
  saveRequest,
  updateRequest,
  updateRequestStatus,
} from "../controllers/requests";
import {
  approveUser,
  declineUser,
  getAllInternalUsers,
  getAllUsers,
  getAllVendors,
  getUserByEmail,
  saveUser,
} from "../controllers/users";
import { generateReqNumber } from "../services/requests";
import {
  generateUserNumber,
  hashPassword,
  validPassword,
} from "../services/users";

export const requetsRouter = Router();

requetsRouter.get("/", async (req, res) => {
  res.send(await getAllRequests());
});

requetsRouter.get("/:createdBy", async (req, res) => {
  let { createdBy } = req.params;
  res.send(await getAllRequestsByCreator(createdBy));
});

requetsRouter.get("/countsByDep", async (req, res) => {
  res.send(await getReqCountsByDepartment());
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
    approvalDate,
    title,
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
    approvalDate,
    title
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

requetsRouter.put("/:id", async (req, res) => {
  let { id } = req.params;
  let { updates } = req.body;
  res.send(await updateRequest(id, updates));
});
