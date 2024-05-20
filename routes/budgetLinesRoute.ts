import { ObjectId, Types } from "mongoose";
import { Router } from "express";
import { BudgetLine } from "../classrepo/budgetLines";
import {
  getAllBudgetLines,
  saveBudgetLine,
  updateBudgetLine,
} from "../controllers/budgetLines";

export const budgetLinesRouter = Router();

budgetLinesRouter.get("/", async (req, res) => {
  res.status(200).send(await getAllBudgetLines());
});

budgetLinesRouter.put("/:id", async (req, res) => {
  let { id } = req.params;
  let { update } = req.body;

  console.log(id);
  let updated = await updateBudgetLine(id as String, update);
  res.send(updated);
});

budgetLinesRouter.post("/", async (req, res) => {
  let { description, department } = req.body;

  let budgetLine = new BudgetLine(
    true,
    description,
    new Types.ObjectId(department)
  );
  console.log(budgetLine);

  res.status(201).send(await saveBudgetLine(budgetLine));
});
