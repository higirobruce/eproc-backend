import { Router } from "express";
import {
  getAllDepartments,
  saveDepartment,
  updateDepartment,
} from "../controllers/departments";
import { Department } from "../classrepo/departments";
import { generateDptNumber } from "../services/dpt";

export const dptRouter = Router();

dptRouter.get("/", async (req, res) => {
  res.status(200).send(await getAllDepartments());
});

dptRouter.post("/", async (req, res) => {
  let { description } = req.body;
  let newNumber = await generateDptNumber();
  let newDpt = await saveDepartment(
    new Department(newNumber, description, true)
  );

  console.log(newDpt)
  res.send(newDpt);
});

dptRouter.put("/:id", async (req, res) => {
  let { id } = req.params;
  let { update } = req.body;

  let updated = updateDepartment(id as String, update);
  res.send(updated);
});
