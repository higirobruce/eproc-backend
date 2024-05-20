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
  let { year } = req.query;
  let nContracts = await getContractsTotalAnalytics(year);
  let contractsLeadTime = await getContractLeadTime(year);

  let nTenders = await getTendersTotalAnalytics(year);

  let nPos = await getPoTotalAnalytics(year);
  let posLeadTime = await getPOLeadTime(year)

  let merged = nContracts.concat(nTenders).concat(nPos);

  let statusContracts = await getContractStatusAnalytics(year);
  let statusTenders = await getTenderStatusAnalytics(year);
  let statusPOS = await getPoStatusAnalytics(year);

  let departmentSpend = await getDepartmentSpend(year);

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
