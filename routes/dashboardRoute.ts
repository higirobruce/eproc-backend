import { Router } from "express";
import {
  getContractStatusAnalytics,
  getContractsTotalAnalytics,
} from "../controllers/contracts";
import {
  getTenderStatusAnalytics,
  getTendersTotalAnalytics,
} from "../controllers/tenders";
import {
  getPoStatusAnalytics,
  getPoTotalAnalytics,
} from "../controllers/purchaseOrders";

export const dashboardRoute = Router();

dashboardRoute.get("/", async (req, res) => {
  let { year } = req.query;
  let nContracts = await getContractsTotalAnalytics(year);
  let nTenders = await getTendersTotalAnalytics(year);
  let nPos = await getPoTotalAnalytics(year);

  let statusContracts = await getContractStatusAnalytics(year);
  let statusTenders = await getTenderStatusAnalytics(year);
  let statusPOS = await getPoStatusAnalytics(year);

  res.send([
    { item: "Tenders", data: nTenders, statusData: statusTenders },
    { item: "Contracts", data: nContracts, statusData: statusContracts },
    { item: "Purchase Orders", data: nPos, statusData: statusPOS },
  ]);
});
