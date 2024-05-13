import { Router } from "express";
import { getAllDepartments } from "../controllers/departments";

export const masterDataRoute = Router();

masterDataRoute.get("/departments", async (req, res) => {
    console.log('hejerekjer')
  res.status(200).send(await getAllDepartments());
});
