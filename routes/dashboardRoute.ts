import { Router } from "express";
import {
  getContractLeadTime,
  getContractStatusAnalytics,
  getContractsTotalAnalytics,
} from "../controllers/contracts";
import {
  getTenderStatusAnalytics,
  getTendersTotalAnalytics,
} from "../controllers/tenders";
import {
  getPOLeadTime,
  getPoStatusAnalytics,
  getPoTotalAnalytics,
} from "../controllers/purchaseOrders";

import * as _ from "lodash";
import { getDepartmentSpend } from "../controllers/paymentRequests";

export const dashboardRoute = Router();

dashboardRoute.get("/", async (req, res) => {
  let { year, currency } = req.query;
  let nContracts = await getContractsTotalAnalytics(year, currency);
  let contractsLeadTime = await getContractLeadTime(year, currency);

  let nTenders = await getTendersTotalAnalytics(year, currency);

  let nPos = await getPoTotalAnalytics(year, currency);
  let posLeadTime = await getPOLeadTime(year, currency)

  let merged = nContracts.concat(nTenders).concat(nPos);

  let statusContracts = await getContractStatusAnalytics(year, currency);
  let statusTenders = await getTenderStatusAnalytics(year, currency);
  let statusPOS = await getPoStatusAnalytics(year, currency);

  let departmentSpend = await getDepartmentSpend(year, currency);

  // res.send([
  //   { item: "Tenders", data: nTenders, statusData: statusTenders },
  //   { item: "Contracts", data: nContracts, statusData: statusContracts },
  //   { item: "Purchase Orders", data: nPos, statusData: statusPOS },
  // ]);

  res.send({
    data: groupBy(merged, "month"),
    statusData: {
      tenders: statusTenders,
      contracts: statusContracts,
      purchaseOrders: statusPOS,
    },
    departmentExpanditure: departmentSpend,
    contractsLeadTime: contractsLeadTime[0]?.days || 0,
    posLeadTime: posLeadTime[0]?.days || 0
  });
});

function groupBy(objectArray: any, property: any) {
  return objectArray.reduce(function (acc: any, obj: any) {
    var key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}
