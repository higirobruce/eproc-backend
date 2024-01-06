import { Types } from "mongoose";
import moment from "moment";
import { PaymentRequestModel } from "../models/paymentRequests";
import { UserModel } from "../models/users";

export async function getAllPaymentRequests() {
  try {
    let paymentRequests = await PaymentRequestModel.find()
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
    return createdPaymentRequest.populate(
      "purchaseOrder createdBy approver reviewedBy budgetLine"
    );
  } catch (err) {
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
    createdBy == "null"
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
              localField: "creaetedBy",
              foreignField: "_id",
              as: "createdBy",
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
            $lookup: {
              from: "users",
              localField: "reviewedBy",
              foreignField: "_id",
              as: "reviewedBy",
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
              preserveNullAndEmptyArrays: false,
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
              localField: "creaetedBy",
              foreignField: "_id",
              as: "createdBy",
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
            $lookup: {
              from: "users",
              localField: "reviewedBy",
              foreignField: "_id",
              as: "reviewedBy",
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
        ];
  let res1 = await PaymentRequestModel.aggregate(pipeline);

  console.log(res1, createdBy);
  let reqs = await PaymentRequestModel.find(query).populate(
    "createdBy purchaseOrder approver reviewedBy budgetLine"
  );

  return res1;
}

export async function getAllRequestsByStatus(status: String, id: String) {
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
            $in: ["approved (hod)", "reviewed"],
          },
        }
      : { status };
  if (id && id !== "null") query = { ...query, createdBy: id };
  let reqs = await PaymentRequestModel.find(query).populate(
    "createdBy purchaseOrder approver reviewedBy budgetLine"
  );
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
  try {
    let newRequest = await PaymentRequestModel.findByIdAndUpdate(id, update, {
      new: true,
    });
    return newRequest;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
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
  paymentProof: boolean,
  cb: any
) {
  let updatedRequest = !paymentProof
    ? PaymentRequestModel.updateOne(
        { docIds: oldFileName },
        { $set: { "docIds.$": newFileName } }
      )
        .then((value) => {
          console.log(newFileName);
          setTimeout(() => {
            cb(null, newFileName);
            console.log(value);
            return value;
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
        })
    : PaymentRequestModel.updateOne(
        { paymentProofDocs: oldFileName },
        { $set: { "paymentProofDocs.$": newFileName } }
      )
        .then((value) => {
          console.log(newFileName);
          setTimeout(() => {
            cb(null, newFileName);
            console.log(value);
            return value;
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
        });
}
