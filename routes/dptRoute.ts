import { Router } from "express";
import {
  getAllDepartments,
  updateDepartment,
} from "../controllers/departments";

export const dptRouter = Router();

dptRouter.get("/", async (req, res) => {
  res.status(200).send(await getAllDepartments());
});

dptRouter.put("/:id", async (req, res) => {
  let { id } = req.params;
  let { update } = req.body;

  let updated = updateDepartment(id as String, update);
  res.send(updated);
});


