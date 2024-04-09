import moment from "moment";
import { ObjectId } from "mongoose";
import { Request } from "../classrepo/requests";
import { RequestModel } from "../models/requests";
import { UserModel } from "../models/users";
import { send } from "../utils/sendEmailNode";
import {
  getUserIdByEmail,
  postSlackMessage,
  sendMessage,
} from "../utils/postToSlack";

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

export async function getAllRequestsByCreator(
  createdBy: String,
  user?: any,
  permissions?: any
) {
  /*
    if pm
    query all

    if hof
    query for all approved (hod), for created by me, where level 1 approver is me, not pending


    if hod
    query created by me, and where level 1 approver is me


    if normal user
    query for those created by me regardless of the status

    */

  let query = {};

  if (createdBy && createdBy !== "null")
    query = { createdBy, status: { $ne: "withdrawn" } };

  if (permissions?.canApproveAsHod || permissions?.canApproveAsPM) {
    query = {
      ...query,
      $or: [{ level1Approver: user?._id }, { createdBy: user?._id }],
    };
  }

  if (permissions?.canApproveAsHof || permissions?.canApproveAsPM)
    query = {
      ...query,
      $or: [
        { createdBy: user?._id },
        {
          status: {
            $in: [
              "approved (hod)",
              "approved (pm)",
              "approved",
              "approved (fd)",
              "withdrawn",
              "archived",
            ],
          },
        },
        { status: { $in: ["pending"] }, level1Approver: user?._id },
      ],
    };

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
    .populate("budgetLine")
    .sort({ number: -1 });

  return reqs;
  // return permissions?.canApproveAsPM
  //   ? reqs
  //   : permissions?.canApproveAsHof
  //   ? reqs.filter(
  //       (item) =>
  //         item?.createdBy?._id == user?._id ||
  //         item?.status == "approved (hod)" ||
  //         item?.status == "appoved (pm)" ||
  //         item?.status == "approved"
  //     )
  //   : permissions?.canApproveAsHod
  //   ? reqs.filter(
  //       (item) =>
  //         item?.createdBy?._id == user?._id ||
  //         item?.level1Approver?._id == user?._id
  //     )
  //   : reqs.filter((item) => item?.createdBy?._id == user?._id);
}

export async function getAllRequestsByStatus(
  status: String,
  id: String,
  permissions: any,
  user: any
) {
  let query: any =
    status === "pending"
      ? {
          status: {
            $in: [
              "pending",
              "approved (hod)",
              "approved (fd)",
              "approved (pm)",
              "withdrawn",
              "archived",
            ],
          },
        }
      : { status };
  if (id && id !== "null") query = { ...query, createdBy: id };

  if (permissions?.canApproveAsHod || permissions?.canApproveAsPM) {
    query = {
      ...query,
      $or: [{ level1Approver: id }, { createdBy: id }],
    };
  }

  if (permissions?.canApproveAsHof || permissions?.canApproveAsPM)
    query = {
      ...query,
      $or: [
        { createdBy: id },
        {
          status: {
            $in: [
              "approved (hod)",
              "approved (pm)",
              "approved",
              "approved (fd)",
              "withdrawn",
              "archived",
            ],
            // $nin: ["withdrawn"],
          },
        },
        { status: { $in: ["pending"] }, level1Approver: id },
      ],
    };

  let reqs = await RequestModel.find(query)
    .sort({ number: -1 })
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
  send(
    "",
    approver?.email,
    "Purchase request approval",
    JSON.stringify(newReq),
    "",
    "approval"
  );

  // await postSlackMessage(
  //   `${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}/system/requests/${newReq?._id}`,
  //   "Bruce Higiro",
  //   newReq
  // );

  let r: any = newReq;

  // r.message = `You a request from *<fakeLink.toEmployeeProfile.com|Bruce Higiro>*`;
  // let slackUserId = await getUserIdByEmail(approver?.email);

  // if (slackUserId)
  //   await sendMessage(
  //     slackUserId,
  //     r,
  //     `${process.env.IRMB_APP_SERVER}:${process.env.IRMB_APP_PORT}/system/requests/${newReq?._id}`
  //   );

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
        JSON.stringify(response),
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
        JSON.stringify(newRequest),
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
        JSON.stringify(newRequest),
        "",
        "approval"
      );
    }

    if (newStatus === "archived") {
      let initiator = await UserModel.find({
        _id: newRequest?.createdBy,
      });

      send(
        "",
        initiator[0]?.email,
        "Purchase request Archived",
        JSON.stringify(newRequest),
        "",
        "pr-archived"
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
  if (update.status === "pending") {
    update.reasonForRejection = "";
    update.declinedBy = "";
  }
  try {
    let newRequest = await RequestModel.findByIdAndUpdate(id, update, {
      new: true,
    })
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
  return result.sort((a, b) => (a._id < b._id ? -1 : 1));
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

  return result.sort((a, b) => (a._id < b._id ? -1 : 1));
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

  return result.sort((a, b) => (a._id < b._id ? -1 : 1));
}
