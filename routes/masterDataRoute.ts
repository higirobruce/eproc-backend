import { Router } from "express";
import { getAllDepartments } from "../controllers/departments";
import { getAllBudgetLinesOnly } from "../controllers/budgetLines";

export const masterDataRoute = Router();

masterDataRoute.get("/departments", async (req, res) => {
  res.status(200).send(await getAllDepartments());
});

masterDataRoute.get("/budgetlines", async (req, res) => {
  res.status(200).send(await getAllBudgetLinesOnly());
});
