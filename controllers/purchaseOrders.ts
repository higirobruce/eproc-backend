import { PurchaseOrder } from "../classrepo/purchaseOrders";
import { PurchaseOrderModel } from "../models/purchaseOrders";
import { DocumentLines } from "../types/types";
import { updateRequestStatus } from "./requests";
import { LocalStorage } from "node-localstorage";
import { sapLogin } from "../utils/sapB1Connection";
import mongoose, { mongo } from "mongoose";
import { PaymentRequestModel } from "../models/paymentRequests";
import { fetch } from 'cross-fetch';
let localstorage = new LocalStorage("./scratch");

/**
 * Get all POs in the database. This is used to populate the list of purchases and get the purchase order for each purchase
 *
 *
 * @return { Promise } A promise that resolves with an array
 */
export async function getAllPOs() {
  let pos = await PurchaseOrderModel.find()
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
    });
  return pos;
}

/**
 * Get purchase order by tender id. This is used to populate the form fields when creating a new purchase order
 *
 * @param tenderId - The id of the tender
 * @param String
 *
 * @return { Object } The purchase order with the tender id as key and the request as value. If there is no purchase order with the tender id null is
 */
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
    });
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
    });
  return pos;
}

export async function getAllPOsByStatus(status: string) {
  let query =
    status == "signed"
      ? { $or: [{ status }, { status: "started" }] }
      : { status: { $in: status } };

  let pos = await PurchaseOrderModel.find(query);

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
    });
  return pos;
}

/**
 * Get purchase order by vendor id. This is used for testing purposes to ensure that the user doesn't accidentally get an error when trying to create a purchase order that does not exist.
 *
 * @param vendorId - Vendor id to look for. If null or " " will return all pos.
 * @param String
 *
 * @return { Promise } The promise is resolved with an object with the following properties : tender : The user's tender createdBy : The user's created by
 */
export async function getPOByVendorId(vendorId: String) {
  let pos = await PurchaseOrderModel.find({
    vendor: vendorId,
    status: { $in: ["partially-signed", "signed", "started"] },
  })
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
    });

  return pos;
}

/**
 * Updates the status of Purchase Order. This is a convenience method for updating the status of a Purchase Order
 *
 * @param id - The id of the Po to update
 * @param String
 * @param newStatus - The status to set the PO to.
 *
 * @return { Object } The result of the action i. e. { message : true|false errorMessage :'Error '
 */
export async function updatePOStatus(id: String, newStatus: String) {
  try {
    await PurchaseOrderModel.findByIdAndUpdate(id, {
      $set: { status: newStatus },
    });
    return { message: "done" };
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

/**
 * Updates the progress of purchase order. It is used to update the delivery progress of a purchased order
 *
 * @param id - ID of the purchase order
 * @param String
 * @param progress - String representing the amount of the order that has been dismissed
 *
 * @return { Object } Object with error flag and errorMessage set if an error occured during update otherwise an error is
 */
export async function updateProgress(id: String, updates: String) {
  try {
    let a = await PurchaseOrderModel.findByIdAndUpdate(id, updates, {
      returnOriginal: false,
    });
    return a;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

/**
 * Saves a Purchase Order to the database. This will throw if there is an error saving the PO.
 *
 * @param po - The Purchase Order to save. Must be an instance of PurchaseOrder
 * @param PurchaseOrder
 *
 * @return { Promise } The created PO
 */
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
  console.log('heeere')
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
        console.log(res);
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
        status: {$nin:['withdrawn','declined']}
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
    console.log(pipelineResult);

    return pipelineResult[0] || { totalPaymentVal: 0, poVal: -1 };
  } catch (err: any) {
    console.log(err);
    return { totalPaymentVal: 0, poVal: -1 };
  }
}

export async function getPOPaidRequests(id: string) {
  let pipeline = [
    {
      $match: {
        purchaseOrder: new mongoose.Types.ObjectId(id),
        status: {$in:['paid']}
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
    console.log(pipelineResult);

    return pipelineResult[0] || { totalPaymentVal: 0, poVal: -1 };
  } catch (err: any) {
    console.log(err);
    return { totalPaymentVal: 0, poVal: -1 };
  }
}
