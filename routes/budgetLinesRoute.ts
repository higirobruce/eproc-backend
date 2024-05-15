import { Router } from "express";
import { BudgetLine } from "../classrepo/budgetLines";
import { getAllBudgetLines, saveBudgetLine } from "../controllers/budgetLines";

export const budgetLinesRouter = Router();

budgetLinesRouter.get("/", async (req, res) => {
  res.status(200).send(await getAllBudgetLines());
});

budgetLinesRouter.post("/", async (req, res) => {
  let { title, subLines } = req.body;

  let budgetLine = new BudgetLine(title, subLines, true);

  res.status(201).send(await saveBudgetLine(budgetLine));
});
