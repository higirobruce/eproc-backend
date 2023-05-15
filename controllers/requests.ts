import moment from "moment";
import { ObjectId } from "mongoose";
import { Request } from "../classrepo/requests";
import { RequestModel } from "../models/requests";
import { UserModel } from "../models/users";
import { send } from "../utils/sendEmailNode";

export async function getAllRequests() {
  let reqs = await RequestModel.find({ status: { $ne: "withdrawn" } })
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
  return reqs;
}

export async function getRequestById(id: String) {
  let reqs = await RequestModel.findById(id)
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
  return reqs;
}

export async function getAllRequestsByCreator(createdBy: String) {
  let query = {};
  if (createdBy && createdBy !== "null")
    query = { createdBy, status: { $ne: "withdrawn" } };
  let reqs = await RequestModel.find(query)
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
  return reqs;
}

export async function getAllRequestsByStatus(status: String, id: String) {
  let query: any =
    status === "pending"
      ? {
          status: {
            $in: [
              "pending",
              "approved (hod)",
              "approved (fd)",
              "approved (pm)",
            ],
          },
        }
      : { status };
  if (id && id !== "null") query = { ...query, createdBy: id };
  let reqs = await RequestModel.find(query)
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
  return reqs;
}

export async function saveRequest(request: Request) {
  let newReq = await RequestModel.create(request);

  //Sending Email notification
  let approver = await UserModel.findById(request.level1Approver);
  send("", approver?.email, "Purchase request approval", "", "", "approval");

  return newReq;
}

export async function approveRequest(id: String) {
  try {
    await RequestModel.findByIdAndUpdate(id, { $set: { status: "approved" } });
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
    let response = await RequestModel.findByIdAndUpdate(
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

    //Sending email notification
    let requestor = await UserModel.findById(response?.createdBy);
    if (requestor?.email) {
      send(
        "",
        requestor?.email,
        "Your Purchase request was rejected",
        "",
        "",
        "rejection"
      );
    }

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

    let newRequest = await RequestModel.findByIdAndUpdate(
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
      send(
        "",
        approversEmails,
        "Purchase request approval",
        "",
        "",
        "approval"
      );
    }

    if (newStatus === "approved (fd)") {
      let level3Approvers = await UserModel.find({
        "permissions.canApproveAsPM": true,
      });
      let approversEmails = level3Approvers?.map((l3) => {
        return l3?.email;
      });
      send(
        "",
        approversEmails,
        "Purchase request approval",
        "",
        "",
        "approval"
      );
    }

    return RequestModel.populate(
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

    let newRequest = await RequestModel.findByIdAndUpdate(
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
    let newRequest = await RequestModel.findByIdAndUpdate(id, update, {
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

export async function getReqCountsByDepartment() {
  let lookup = [
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
        from: "departments",
        localField: "createdBy.department",
        foreignField: "_id",
        as: "department",
      },
    },
    {
      $unwind: {
        path: "$department",
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $group: {
        _id: "$department.description",
        totalCount: {
          $count: {},
        },
      },
    },
  ];

  let result = await RequestModel.aggregate(lookup);
  return result;
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

  let result = await RequestModel.aggregate(lookup);
  return result;
}

export async function getReqCountsByBudgetStatus() {
  let lookup = [
    {
      $group: {
        _id: "$budgeted",
        count: {
          $count: {},
        },
      },
    },
  ];

  let result = await RequestModel.aggregate(lookup);
  return result;
}

export async function getReqCountsByCategory() {
  let lookup = [
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
      $group: {
        _id: "$serviceCategory",
        totalCount: {
          $count: {},
        },
      },
    },
  ];

  let result = await RequestModel.aggregate(lookup);
  return result;
}
