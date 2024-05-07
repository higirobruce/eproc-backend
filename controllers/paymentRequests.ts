import mongoose, { Types } from "mongoose";
import moment from "moment";
import { PaymentRequestModel } from "../models/paymentRequests";
import { UserModel } from "../models/users";
import { logger } from "../utils/logger";

export async function getAllPaymentRequests() {
  try {
    let paymentRequests = await PaymentRequestModel.find()
      .sort({ number: -1 })
      .populate("createdBy purchaseOrder")
      .populate({
        path: "purchaseOrder",
        populate: {
          path: "tender",
          model: "Tender",
        },
      })
      .populate({
        path: "purchaseOrder.tender",
        populate: {
          path: "purchaseRequest",
          model: "Request",
        },
      })
      .populate({
        path: "purchaseOrder",
        populate: {
          path: "request",
          model: "Request",
        },
      })
      .populate("approver")
      .populate("reviewedBy")
      .populate("budgetLine");
    return paymentRequests;
  } catch (err) {
    throw err;
  }
}

export async function savePaymentRequest(paymentRequest: PaymentRequest) {
  try {
    let createdPaymentRequest = await PaymentRequestModel.create(
      paymentRequest
    );
    logger.log({
      level: "info",
      message: `${createdPaymentRequest} successfully created`,
    });
    return createdPaymentRequest.populate(
      "purchaseOrder createdBy approver reviewedBy budgetLine"
    );
  } catch (err) {
    logger.log({
      level: "error",
      message: `${paymentRequest} failed to be created created`,
      issue: `${err}`,
    });
    throw err;
  }
}

export async function getPaymentRequestById(id: String) {
  let reqs = await PaymentRequestModel.findById(id)
    .populate("createdBy purchaseOrder")
    .populate({
      path: "purchaseOrder",
      populate: {
        path: "tender",
        model: "Tender",
      },
    })
    .populate({
      path: "purchaseOrder.tender",
      populate: {
        path: "purchaseRequest",
        model: "Request",
      },
    })
    .populate({
      path: "purchaseOrder",
      populate: {
        path: "request",
        model: "Request",
      },
    })
    .populate("approver")
    .populate("reviewedBy")
    .populate("budgetLine");
  return reqs;
}

export async function getAllRequestsByCreator(createdBy: any) {
  let query = {};
  if (createdBy && createdBy !== "null")
    query = {
      createdBy,
      $or: [
        {
          createdBy,
        },
      ],

      status: { $ne: "withdrawn" },
    };
  let pipeline =
    createdBy == "null" || !createdBy
      ? [
          {
            $match: {
              status: { $ne: "withdrawn" },
            },
          },
          {
            $lookup: {
              from: "purchaseorders",
              localField: "purchaseOrder",
              foreignField: "_id",
              as: "purchaseOrder",
            },
          },
          {
            $unwind: {
              path: "$purchaseOrder",
              includeArrayIndex: "string",
              preserveNullAndEmptyArrays: true,
            },
          },
          // {
          //   $match: {
          //     $or: [
          //       {
          //         "purchaseOrder.vendor": createdBy
          //         ,
          //       },
          //       {
          //         createdBy: createdBy,
          //       },
          //     ],
          //   },
          // },
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
              includeArrayIndex: "string",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "approver",
              foreignField: "_id",
              as: "approver",
            },
          },
          {
            $unwind: {
              path: "$approver",
              includeArrayIndex: "string",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "reviewedBy",
              foreignField: "_id",
              as: "reviewedBy",
            },
          },
          {
            $unwind: {
              path: "$reviewedBy",
              includeArrayIndex: "string",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "budgetlines",
              localField: "budgetLine",
              foreignField: "_id",
              as: "budgetLine",
            },
          },
          {
            $unwind: {
              path: "$budgetLine",
              includeArrayIndex: "string",
              preserveNullAndEmptyArrays: true,
            },
          },
        ]
      : [
          {
            $match: {
              status: { $ne: "withdrawn" },
            },
          },
          {
            $lookup: {
              from: "purchaseorders",
              localField: "purchaseOrder",
              foreignField: "_id",
              as: "purchaseOrder",
            },
          },
          {
            $unwind: {
              path: "$purchaseOrder",
              includeArrayIndex: "string",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              $or: [
                {
                  "purchaseOrder.vendor": new Types.ObjectId(createdBy),
                },
                {
                  createdBy: new Types.ObjectId(createdBy),
                },
              ],
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
              includeArrayIndex: "string",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "approver",
              foreignField: "_id",
              as: "approver",
            },
          },
          {
            $unwind: {
              path: "$approver",
              includeArrayIndex: "string",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "reviewedBy",
              foreignField: "_id",
              as: "reviewedBy",
            },
          },
          {
            $unwind: {
              path: "$reviewedBy",
              includeArrayIndex: "string",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "budgetlines",
              localField: "budgetLine",
              foreignField: "_id",
              as: "budgetLine",
            },
          },
          {
            $unwind: {
              path: "$budgetLine",
              includeArrayIndex: "string",
              preserveNullAndEmptyArrays: true,
            },
          },
        ];
  let res1 = await PaymentRequestModel.aggregate(pipeline).sort({ number: -1 });

  let reqs = await PaymentRequestModel.find(query)
    .populate("createdBy purchaseOrder approver reviewedBy budgetLine")
    .sort({ number: -1 });

  return res1;
}

export async function getAllRequestsByStatus(status: String, id: any) {
  let query: any =
    status === "pending-review"
      ? {
          status: {
            $in: ["pending-review"],
          },
        }
      : status === "pending-approval"
      ? {
          status: {
            $in: ["approved (hod)", "reviewed", "pending-approval"],
          },
        }
      : { status };

  let query2 = {};

  if (id && id !== "null")
    query = {
      ...query,
      $or: [
        {
          "purchaseOrder.vendor": new Types.ObjectId(id),
        },
        {
          createdBy: new Types.ObjectId(id),
        },
      ],
    };

  let pipeline = [
    {
      $match: query,
    },
    {
      $lookup: {
        from: "purchaseorders",
        localField: "purchaseOrder",
        foreignField: "_id",
        as: "purchaseOrder",
      },
    },
    {
      $unwind: {
        path: "$purchaseOrder",
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: query2,
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
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "approver",
        foreignField: "_id",
        as: "approver",
      },
    },
    {
      $unwind: {
        path: "$approver",
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "reviewedBy",
        foreignField: "_id",
        as: "reviewedBy",
      },
    },
    {
      $unwind: {
        path: "$reviewedBy",
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "budgetlines",
        localField: "budgetLine",
        foreignField: "_id",
        as: "budgetLine",
      },
    },
    {
      $unwind: {
        path: "$budgetLine",
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  let reqs = await PaymentRequestModel.find(query)
    .populate("createdBy purchaseOrder approver reviewedBy budgetLine")
    .sort({ number: -1 });

  // let reqs2 = await PaymentRequestModel.aggregate(pipeline).sort({"number": -1});

  // console.log(reqs2.length);
  return reqs;
}

export async function approveRequest(id: String) {
  try {
    await PaymentRequestModel.findByIdAndUpdate(id, {
      $set: { status: "approved" },
    });
    return { message: "done" };
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function declineRequest(
  id: String,
  reason: String,
  declinedBy: String
) {
  try {
    let response = await PaymentRequestModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "declined",
          reasonForRejection: reason,
          declinedBy: declinedBy,
          rejectionDate: moment(),
        },
      },
      { new: true }
    ).populate("createdBy purchaseOrder approver");

    //Sending email notification
    let requestor = await UserModel.findById(response?.createdBy);

    return response;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function updateRequestStatus(id: String, newStatus: String) {
  try {
    let update = {};
    if (newStatus === "approved (hod)")
      update = { status: newStatus, hod_approvalDate: Date.now() };
    else if (newStatus === "approved (fd)")
      update = { status: newStatus, hof_approvalDate: Date.now() };
    else if (newStatus === "approved (pm)")
      update = { status: newStatus, pm_approvalDate: Date.now() };
    else update = { status: newStatus };

    let newRequest = await PaymentRequestModel.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    );

    //Sending email notifications
    if (newStatus === "approved (hod)") {
      let level2Approvers = await UserModel.find({
        "permissions.canApproveAsHof": true,
      });
      let approversEmails = level2Approvers?.map((l2) => {
        return l2?.email;
      });
    }

    if (newStatus === "approved (fd)") {
      let level3Approvers = await UserModel.find({
        "permissions.canApproveAsPM": true,
      });
      let approversEmails = level3Approvers?.map((l3) => {
        return l3?.email;
      });
    }

    return PaymentRequestModel.populate(
      newRequest,
      "createdBy level1Approver budgetLine"
    );
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function updateRequestSourcingMethod(
  id: String,
  sourcingMethod: String
) {
  try {
    let update = { sourcingMethod: sourcingMethod };

    let newRequest = await PaymentRequestModel.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    )
      .populate("createdBy")
      .populate("level1Approver")
      .populate({
        path: "createdBy",
        populate: {
          path: "department",
          model: "Department",
        },
      })
      .populate("budgetLine");

    return newRequest;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function updateRequest(id: String, update: Request) {
  let newRequest = await PaymentRequestModel.findByIdAndUpdate(id, update, {
    new: true,
  });

  return newRequest;
}

export async function getReqCountsByStatus() {
  let lookup = [
    {
      $group: {
        _id: "$status",
        count: {
          $count: {},
        },
      },
    },
  ];

  let result = await PaymentRequestModel.aggregate(lookup);

  return result.sort((a, b) => (a._id < b._id ? -1 : 1));
}

export async function updateRequestFileName(
  oldFileName: any,
  newFileName: string,
  paymentProof: boolean
  // cb: any
) {
  let updatedRequest = !paymentProof
    ? await PaymentRequestModel.updateOne(
        { docIds: oldFileName },
        { $set: { "docIds.$": newFileName } }
      )
    : await PaymentRequestModel.updateOne(
        { paymentProofDocs: oldFileName },
        { $set: { "paymentProofDocs.$": newFileName } }
      );
  return updateRequest;
}

export async function getPayReqTotalAnalytics(year: any) {
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
      $addFields:
        /**
         * newField: The new field name.
         * expression: The new field expression.
         */
        {
          budgeted: {
            $cond: {
              if: {
                $eq: ["$budgeted", true],
              },
              then: true,
              else: false,
            },
          },
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
        budgeted: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$budgeted", true],
              },
              then: 1,
              else: 0,
            },
          },
        },
        nonbudgeted: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$budgeted", false],
              },
              then: 1,
              else: 0,
            },
          },
        },
        total: {
          $sum: 1,
        },
      },
    },
  ];

  let req = await PaymentRequestModel.aggregate(pipeline).sort({ _id: 1 });
  return req;
}

export async function getPayReqStatusAnalytics(year: any) {
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
                  $eq: ["$status", "pending-review"],
                },
                {
                  $eq: ["$status", "reviewed"],
                },
                {
                  $eq: ["$status", "approved (hod)"],
                },
                {
                  $eq: ["$status", "approved (hof)"],
                },
                {
                  $eq: ["$status", "pending"],
                },
              ],
            },
            then: "pending approval",
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

  let req = await PaymentRequestModel.aggregate(pipeline);
  return req;
}

export async function getPayReqSpendTrack(year: any) {
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
        year,
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
        requests: {
          $sum: 1,
        },
        total_paid: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$status", "paid"],
              },
              then: "$amount",
              else: 0,
            },
          },
        },
        total_requests: {
          $sum: "$amount",
        },
      },
    },
  ];

  try {
    let req = await PaymentRequestModel.aggregate(pipeline);
    return req;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getPayReqSpendTrackTotals(year: any) {
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
        year,
      },
    },
    {
      $group: {
        _id: "",
        total_requests: {
          $sum: 1,
        },
        // total_paid: {
        //   $sum: {
        //     $cond: {
        //       if: {
        //         $eq: ["$status", "paid"],
        //       },
        //       then: "$amount",
        //       else: 0,
        //     },
        //   },
        // },
        total_amount: {
          $sum: "$amount",
        },
        average_request: {
          $avg: "$amount",
        },
      },
    },
  ];

  let req = await PaymentRequestModel.aggregate(pipeline);
  return req;
}

export async function getPayReqSpendTrackBudgets(year: any) {
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
        year,
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$amount",
        },
        budgeted: {
          $sum: {
            $cond: [
              {
                $eq: ["$budgeted", true],
              },
              "$amount",
              0,
            ],
          },
        },
        unbudgeted: {
          $sum: {
            $cond: [
              {
                $eq: ["$budgeted", false],
              },
              "$amount",
              0,
            ],
          },
        },
        total_budgeted: {
          $sum: {
            $cond: [
              {
                $eq: ["$budgeted", true],
              },
              "$amount",
              0,
            ],
          },
        },
        total_unbudgeted: {
          $sum: {
            $cond: [
              {
                $eq: ["$budgeted", false],
              },
              "$amount",
              0,
            ],
          },
        },
      },
    },
    {
      $addFields: {
        budget_ration: {
          $divide: ["$total_budgeted", "$total_unbudgeted"],
        },
      },
    },
    {
      $project: {
        _id: 0,
        budgetedPercentage: {
          $multiply: [
            {
              $divide: ["$budgeted", "$total"],
            },
            100,
          ],
        },
        unbudgetedPercentage: {
          $multiply: [
            {
              $divide: ["$unbudgeted", "$total"],
            },
            100,
          ],
        },
        total_budgeted: 1,
        total_unbudgeted: 1,
        budget_ration: 1,
      },
    },
  ];

  let req = await PaymentRequestModel.aggregate(pipeline);
  return req;
}

export async function getVendorEmail(reqId: any) {
  let pipeline = [
    {
      $match: {
        category: "external",
        _id: new mongoose.Types.ObjectId(reqId),
      },
    },
    {
      $lookup: {
        from: "purchaseorders",
        localField: "purchaseOrder",
        foreignField: "_id",
        as: "purchaseOrder",
      },
    },
    {
      $unwind: {
        path: "$purchaseOrder",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "purchaseOrder.vendor",
        foreignField: "_id",
        as: "vendor",
      },
    },
    {
      $unwind: {
        path: "$vendor",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $addFields: {
        vendorEmail: "$vendor.email",
      },
    },
    {
      $project: {
        vendorEmail: 1,
      },
    },
  ];

  let emailObjs = await PaymentRequestModel.aggregate(pipeline);
  return emailObjs;
}

export async function getDepartmentSpend(year: any) {
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
        year,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "approver",
        foreignField: "_id",
        as: "approver",
      },
    },
    {
      $unwind: {
        path: "$approver",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "departments",
        localField: "approver.department",
        foreignField: "_id",
        as: "department",
      },
    },
    {
      $unwind: {
        path: "$department",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $match: {
        status: "paid",
      },
    },
    {
      $addFields: {
        department: "$department.description",
      },
    },
    {
      $group: {
        _id: "$department",
        budgeted: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$budgeted", true],
              },
              then: "$amount",
              else: 0,
            },
          },
        },
        nonBudgeted: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$budgeted", false],
              },
              then: "$amount",
              else: 0,
            },
          },
        },
      },
    },
    {
      $addFields: {
        name: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ];
  let req = await PaymentRequestModel.aggregate(pipeline);
  return req;
}
