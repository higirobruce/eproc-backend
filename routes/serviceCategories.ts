import { Router } from "express";
import {
  getAllServiceCategories,
  saveCategoryService,
  updateServiceCategory,
} from "../controllers/serviceCategoris";

export const serviceCategoryRouter = Router();

serviceCategoryRouter.get("/", async (req, res) => {
  let categs = await getAllServiceCategories();
  res.status(200).send(categs);
});

serviceCategoryRouter.post("/", async (req, res) => {
  let { description } = req.body;
  console.log(description);
  let categ = await saveCategoryService(description as String);
  res.send(categ);
});

serviceCategoryRouter.put("/:id", async (req, res) => {
  let { id } = req.params;
  let { update } = req.body;

  let updated = await updateServiceCategory(id as String, update);
  res.send(updated);
});
