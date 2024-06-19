import { RequestModel } from "./../models/requests";
import { PurchaseOrder } from "../classrepo/purchaseOrders";
import { PurchaseOrderModel } from "../models/purchaseOrders";
import { DocumentLines } from "../types/types";
import { updateRequestStatus } from "./requests";
import { LocalStorage } from "node-localstorage";
import { sapLogin } from "../utils/sapB1Connection";
import mongoose, { mongo } from "mongoose";
import { PaymentRequestModel } from "../models/paymentRequests";
import { fetch } from "cross-fetch";
import { UserModel } from "../models/users";
import { send } from "../utils/sendEmailNode";
let localstorage = new LocalStorage("./scratch");

/**
 * Get all POs in the database. This is used to populate the list of purchases and get the purchase order for each purchase
 *
 *
 * @return { Promise } A promise that resolves with an array
 */
export async function getAllPOs(req?: any) {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const status = req.query.status;
  const search = req.query.search;

  console.log("Seearh: ", search);

  let pipeline: any[] = [
    {
      $lookup: {
        from: "tenders",
        localField: "tender",
        foreignField: "_id",
        as: "tender",
        pipeline: [
          {
            $lookup: {
              from: "requests",
              localField: "purchaseRequest",
              foreignField: "_id",
              as: "purchaseRequest",
            },
          },
          {
            $unwind: {
              path: "$purchaseRequest",
            },
          },
          {
            $lookup: {
              from: "budgetlines",
              localField: "purchaseRequest.budgetLine",
              foreignField: "_id",
              as: "purchaseRequest.budgetLine",
            },
          },
          {
            $unwind: {
              path: "$purchaseRequest.budgetLine",
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$tender",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "vendor",
        foreignField: "_id",
        as: "vendor",
      },
    },
    {
      $unwind: {
        path: "$vendor",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "requests",
        localField: "request",
        foreignField: "_id",
        as: "request",
      },
    },
    {
      $unwind: {
        path: "$request",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "budgetlines",
        localField: "request.budgetLine",
        foreignField: "_id",
        as: "request.budgetLine",
      },
    },
    {
      $unwind: {
        path: "$request.budgetLine",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
      },
    },
    {
      $unwind: {
        path: "$createdBy",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: {
        number: -1
      }
    }
  ];

  let query =
    status && status !== "null" && status == "all"
      ? {}
      : status == "signed"
      ? { status: { $in: ["signed", "started"] } }
      : status == "pending-signature"
      ? {
          $or: [
            { status: { $in: ["pending-signature"] } },
            { status: { $exists: false } },
          ],
        }
      : { status };

  pipeline.unshift({
    $match: query,
  });

  if (search && search !== "null" && search !== "" && search != "undefined") {
    pipeline.push({
      $match: {
        $or: [
          { number: { $regex: search, $options: "i" } },
          { "vendor.companyName": { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  let purchaseOrderQuery = await PurchaseOrderModel.aggregate(pipeline).sort({
    number: -1,
  });
  let allDocs = purchaseOrderQuery?.length;

  if (pageSize && currentPage) {
    pipeline.push({
      $skip: pageSize * (currentPage - 1),
    });
    pipeline.push({
      $limit: pageSize,
    });
  }

  purchaseOrderQuery = await PurchaseOrderModel.aggregate(pipeline);

  return { data: purchaseOrderQuery, totalPages: allDocs };
}

export async function getPOByTenderId(tenderId: String) {
  let pos = await PurchaseOrderModel.find({ tender: tenderId })
    .populate("tender")
    .populate("vendor")
    .populate("request")
    .populate({
      path: "request",
      populate: {
        path: "budgetLine",
        model: "BudgetLine",
      },
    })
    .populate("createdBy")
    .populate({
      path: "tender",
      populate: {
        path: "purchaseRequest",
        model: "Request",
        populate: {
          path: "budgetLine",
          model: "BudgetLine",
        },
      },
    })
    .sort({ number: -1 });
  return pos;
}

export async function getPOById(id: String) {
  let pos = await PurchaseOrderModel.findById(id)
    .populate("tender")
    .populate("vendor")
    .populate("request")
    .populate({
      path: "request",
      populate: {
        path: "budgetLine",
        model: "BudgetLine",
      },
    })
    .populate("createdBy")
    .populate({
      path: "tender",
      populate: {
        path: "purchaseRequest",
        model: "Request",
        populate: {
          path: "budgetLine",
          model: "BudgetLine",
        },
      },
    })
    .sort({ number: -1 });
  return pos;
}

export async function getAllPOsByStatus(status: string) {
  let query =
    status == "signed"
      ? { $or: [{ status }, { status: "started" }] }
      : { status: { $in: status } };

  let pos = await PurchaseOrderModel.find(query).sort({ number: -1 });

  return pos;
}

export async function getPOByRequestId(requestId: String) {
  let pos = await PurchaseOrderModel.find({ request: requestId })
    .populate("tender")
    .populate("vendor")
    .populate("request")
    .populate({
      path: "request",
      populate: {
        path: "budgetLine",
        model: "BudgetLine",
      },
    })
    .populate("createdBy")
    .populate({
      path: "tender",
      populate: {
        path: "purchaseRequest",
        model: "Request",
        populate: {
          path: "budgetLine",
          model: "BudgetLine",
        },
      },
    })
    .sort({ number: -1 });
  return pos;
}

export async function getPOByVendorId(vendorId: String, status: String) {
  let query =
    status && status !== "null" && status == "all"
      ? { vendor: vendorId, status: { $nin: "withdrawn" } }
      : status == "signed"
      ? {
          vendor: vendorId,
          status: { $in: ["signed", "started"], $nin: "withdrawn" },
        }
      : status == "pending-signature"
      ? {
          vendor: vendorId,
          $or: [
            { status: { $in: ["pending-signature"], $nin: "withdrawn" } },
            { status: { $exists: false } },
          ],
        }
      : { vendor: vendorId, status: { $eq: status, $nin: "withdrawn" } };

  let pos = await PurchaseOrderModel.find(query)
    .populate("tender")
    .populate("vendor")
    .populate("request")
    .populate({
      path: "request",
      populate: {
        path: "budgetLine",
        model: "BudgetLine",
      },
    })
    .populate("createdBy")
    .populate({
      path: "tender",
      populate: {
        path: "purchaseRequest",
        model: "Request",
        populate: {
          path: "budgetLine",
          model: "BudgetLine",
        },
      },
    })
    .sort({ number: -1 });

  return pos;
}

export async function updatePOStatus(id: String, newStatus: String) {
  try {
    let updatedPO = await PurchaseOrderModel.findByIdAndUpdate(id, {
      $set: { status: newStatus },
    });

    //reOpen the purchase request when po is archived
    if (newStatus == "withdrawn") {
      let reqId = updatedPO?.request;
      await RequestModel.findByIdAndUpdate(reqId, {
        $set: { status: "approved (pm)" },
      });

      let signedSignatories: any[] =
        updatedPO?.signatories?.filter((s: any) => s?.signed == true) || [];

      if (signedSignatories?.length >= 1) {
        console.log(signedSignatories);
        signedSignatories?.map((s) => {
          send(
            "from",
            s?.email,
            "Purchase Order Withdrawn",
            JSON.stringify({
              docId: updatedPO?._id,
              docNumber: updatedPO?.number,
              docType: "purchase-orders",
            }),
            "",
            "po-withdrawal"
          );
        });
      }
    }

    if (newStatus == "terminated") {
      let reqs = await getPOPendingRequests(id as string);
      let ids = reqs.map((r) => {
        return r._id;
      });

      await PaymentRequestModel.updateMany(
        {
          _id: { $in: ids },
        },
        { $set: { status: "withdrawn" } }
      );
    }

    return { message: "done" };
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function updateProgress(id: String, updates: String) {
  try {
    let a = await PurchaseOrderModel.findByIdAndUpdate(id, updates, {
      returnOriginal: false,
    });
    let b = { ...a, error: false, errorMessage: "" };

    return b;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function savePO(po: PurchaseOrder) {
  try {
    let createdRecord = await PurchaseOrderModel.create(po);
    return createdRecord;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function savePOInB1(
  CardCode: String,
  DocType: String,
  DocumentLines: DocumentLines[],
  DocCurrency: String
) {
  return sapLogin().then(async (res) => {
    let COOKIE = res.headers.get("set-cookie");
    localstorage.setItem("cookie", `${COOKIE}`);

    return fetch(
      `${process.env.IRMB_B1_SERVER}:${process.env.IRMB_B1_SERVICE_LAYER_PORT}/b1s/v1/PurchaseOrders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `${localstorage.getItem("cookie")}`,
        },
        body: JSON.stringify({ CardCode, DocType, DocumentLines, DocCurrency }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log({ error: true, message: err?.message });
        return { error: true, message: err?.message };
      });
  });
}

export async function updateB1Po(CardCode: String, body: any) {
  return sapLogin().then(async (res) => {
    let COOKIE = res.headers.get("set-cookie");
    localstorage.setItem("cookie", `${COOKIE}`);

    return fetch(
      `${process.env.IRMB_B1_SERVER}:${process.env.IRMB_B1_SERVICE_LAYER_PORT}/b1s/v1/PurchaseOrders(${CardCode})`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `${localstorage.getItem("cookie")}`,
        },
        body: JSON.stringify(body),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  });
}

export async function updatePo(id: String, po: PurchaseOrder) {
  return await PurchaseOrderModel.findByIdAndUpdate(id, po, { new: true });
}

export async function getVendorRate(id: string) {
  let pipeline = [
    {
      $match: {
        vendor: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $group: {
        _id: "$vendor",
        avgRate: {
          $avg: "$rate",
        },
      },
    },
  ];
  try {
    let avg = await PurchaseOrderModel.aggregate(pipeline);
    return avg;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function getPOPaymentRequests(id: string) {
  let pipeline = [
    {
      $match: {
        purchaseOrder: new mongoose.Types.ObjectId(id),
        status: { $nin: ["withdrawn", "declined"] },
      },
    },
    {
      $lookup: {
        from: "purchaseorders",
        localField: "purchaseOrder",
        foreignField: "_id",
        as: "purchaseOrderInfo",
      },
    },
    {
      $unwind: "$purchaseOrderInfo",
    },
    {
      $unwind: {
        path: "$purchaseOrderInfo.items",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: {
          po: "$purchaseOrder",
          poVal: {
            $multiply: [
              {
                $toInt: "$purchaseOrderInfo.items.quantity",
              },
              {
                $toInt: "$purchaseOrderInfo.items.estimatedUnitCost",
              },
            ],
          },
        },
        totalPaymentVal: {
          $sum: "$amount",
        },
      },
    },
    {
      $addFields: {
        poId: "$_id.po",
        poVal: "$_id.poVal",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $group:
        /**
         * _id: The id of the group.
         * fieldN: The first field name.
         */
        {
          _id: {
            poId: "$poId",
            totalPaymentVal: "$totalPaymentVal",
          },
          poVal: {
            $sum: "$poVal",
          },
        },
    },
    {
      $addFields:
        /**
         * newField: The new field name.
         * expression: The new field expression.
         */
        {
          totalPaymentVal: "$_id.totalPaymentVal",
          poId: "$_id.poId",
        },
    },
    {
      $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          _id: 0,
        },
    },
  ];
  try {
    let pipelineResult = await PaymentRequestModel.aggregate(pipeline);

    return pipelineResult[0] || { totalPaymentVal: 0, poVal: -1 };
  } catch (err: any) {
    console.log(err);
    return { totalPaymentVal: 0, poVal: -1 };
  }
}

export async function getPOPendingRequests(id: string) {
  let pipeline = [
    {
      $match: {
        purchaseOrder: new mongoose.Types.ObjectId(id),
        status: {
          $nin: ["withdrawn", "declined", "paid"],
        },
      },
    },
    {
      $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          _id: 1,
        },
    },
  ];
  try {
    let pipelineResult = await PaymentRequestModel.aggregate(pipeline);

    return pipelineResult;
  } catch (err: any) {
    console.log(err);
    return [];
  }
}

export async function getPOPaidRequests(id: string) {
  let pipeline = [
    {
      $match: {
        purchaseOrder: new mongoose.Types.ObjectId(id),
        status: { $in: ["paid"] },
      },
    },
    {
      $lookup: {
        from: "purchaseorders",
        localField: "purchaseOrder",
        foreignField: "_id",
        as: "purchaseOrderInfo",
      },
    },
    {
      $unwind: "$purchaseOrderInfo",
    },
    {
      $unwind: {
        path: "$purchaseOrderInfo.items",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: {
          po: "$purchaseOrder",
          poVal: {
            $multiply: [
              {
                $toInt: "$purchaseOrderInfo.items.quantity",
              },
              {
                $toInt: "$purchaseOrderInfo.items.estimatedUnitCost",
              },
            ],
          },
        },
        totalPaymentVal: {
          $sum: "$amount",
        },
      },
    },
    {
      $addFields: {
        poId: "$_id.po",
        poVal: "$_id.poVal",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $group:
        /**
         * _id: The id of the group.
         * fieldN: The first field name.
         */
        {
          _id: {
            poId: "$poId",
            totalPaymentVal: "$totalPaymentVal",
          },
          poVal: {
            $sum: "$poVal",
          },
        },
    },
    {
      $addFields:
        /**
         * newField: The new field name.
         * expression: The new field expression.
         */
        {
          totalPaymentVal: "$_id.totalPaymentVal",
          poId: "$_id.poId",
        },
    },
    {
      $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          _id: 0,
        },
    },
  ];
  try {
    let pipelineResult = await PaymentRequestModel.aggregate(pipeline);

    return pipelineResult[0] || { totalPaymentVal: 0, poVal: -1 };
  } catch (err: any) {
    console.log(err);
    return { totalPaymentVal: 0, poVal: -1 };
  }
}

export async function getPoTotalAnalytics(year: any) {
  if (!year) {
    year = "2024";
  }
  let pipeline = [
    {
      $addFields: {
        year: {
          $year: "$createdAt",
        },
      },
    },
    {
      $match: {
        year: parseInt(year),
      },
    },

    {
      $group: {
        _id: {
          $month: "$createdAt",
        },
        month: {
          $first: {
            $let: {
              vars: {
                months: [
                  null,
                  "JAN",
                  "FEB",
                  "MAR",
                  "APR",
                  "MAY",
                  "JUN",
                  "JUL",
                  "AUG",
                  "SEP",
                  "OCT",
                  "NOV",
                  "DEC",
                ],
              },
              in: {
                $arrayElemAt: [
                  "$$months",
                  {
                    $month: "$createdAt",
                  },
                ],
              },
            },
          },
        },
        // budgeted: {
        //   $sum: {
        //     $cond: {
        //       if: {
        //         $eq: ["$budgeted", true],
        //       },
        //       then: 1,
        //       else: 0,
        //     },
        //   },
        // },
        // nonbudgeted: {
        //   $sum: {
        //     $cond: {
        //       if: {
        //         $eq: ["$budgeted", false],
        //       },
        //       then: 1,
        //       else: 0,
        //     },
        //   },
        // },
        purchaseOrders: {
          $sum: 1,
        },
      },
    },
  ];

  let req = await PaymentRequestModel.aggregate(pipeline).sort({ _id: 1 });
  return req;
}

export async function getPoStatusAnalytics(year: any) {
  if (!year) {
    year = "2024";
  }
  let pipeline = [
    {
      $addFields: {
        year: {
          $year: "$createdAt",
        },
      },
    },
    {
      $match: {
        year: parseInt(year),
      },
    },
    {
      $addFields: {
        status: {
          $cond: {
            if: {
              $or: [
                {
                  $eq: ["$status", "pending"],
                },
                // {
                //   $eq: ["$status", "partially-signed"],
                // }
              ],
            },
            then: "pending signature",
            else: "$status",
          },
        },
      },
    },
    {
      $group: {
        _id: "$status",
        total: {
          $sum: 1,
        },
      },
    },
  ];

  let req = await PurchaseOrderModel.aggregate(pipeline);
  return req;
}

export async function getTotalNumberOfPOs(year: any) {
  let pipeline = [
    {
      $addFields: {
        year: {
          $year: "$createdAt",
        },
      },
    },
    {
      $match: {
        year: parseInt(year),
      },
    },
    { $count: "total_records" },
  ];

  let count = await PurchaseOrderModel.aggregate(pipeline);
  if (count?.length >= 1) return count[0]?.total_records;
  else return 0;
  // return count;
}

export async function getPOLeadTime(year: any) {
  if (!year) {
    year = "2024";
  }
  let pipeline = [
    {
      $addFields: {
        year: {
          $year: "$createdAt",
        },
      },
    },
    {
      $match: {
        year: parseInt(year),
      },
    },
    {
      $unwind: {
        path: "$signatories",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $match: {
        "signatories.onBehalfOf": {
          $ne: "Irembo Ltd",
        },
      },
    },
    {
      $addFields: {
        signedAt: {
          $toDate: "$signatories.signedAt",
        },
      },
    },
    {
      $match: {
        signedAt: {
          $ne: null,
        },
      },
    },
    {
      $group: {
        _id: null,
        average_lead_time: {
          $avg: {
            $subtract: ["$signedAt", "$createdAt"],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        average_lead_time: {
          $divide: ["$average_lead_time", 86400000],
        },
      },
    },
    {
      $project: {
        days: {
          $round: ["$average_lead_time"],
        },
      },
    },
  ];

  let req = await PurchaseOrderModel.aggregate(pipeline);
  return req;
}
