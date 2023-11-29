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

export async function getAllRequestsByCreator(createdBy: String) {
  let query = {};
  if (createdBy && createdBy !== "null")
    query = { createdBy, status: { $ne: "withdrawn" } };
  let reqs = await PaymentRequestModel.find(query).populate(
    "createdBy purchaseOrder approver reviewedBy budgetLine"
  );

  return reqs;
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
  newFileName: string
) {
  let updatedRequest = await PaymentRequestModel.updateOne(
    { docIds: oldFileName },
    { $set: { "docIds.$": newFileName } }
  );
  return updatedRequest;
}
