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
  let { update } = req.body

  console.log(id)
  let updated = await updateBudgetLine(id as String, update);
  res.send(updated);
});

budgetLinesRouter.post("/", async (req, res) => {
  let { title, subLines } = req.body;

  let budgetLine = new BudgetLine(title, subLines, true, title);
  res.status(201).send(await saveBudgetLine(budgetLine));
});


