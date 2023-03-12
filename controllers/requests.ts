import { ObjectId } from "mongoose";
import { Request } from "../classrepo/requests";
import { RequestModel } from "../models/requests";
import { UserModel } from "../models/users";
import { send } from "../utils/sendEmailNode";

export async function getAllRequests() {
  let reqs = await RequestModel.find()
    .populate("createdBy")
    .populate({
      path: "createdBy",
      populate: {
        path: "department",
        model: "Department",
      },
    });
  return reqs;
}

export async function getAllRequestsByCreator(createdBy: String) {
  let reqs = await RequestModel.find({ createdBy })
    .populate("createdBy")
    .populate({
      path: "createdBy",
      populate: {
        path: "department",
        model: "Department",
      },
    });
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
    let response = await RequestModel.findByIdAndUpdate(id, {
      $set: {
        status: "declined",
        reasonForRejection: reason,
        declinedBy: declinedBy,
      },
    });

    //Sending email notification
    let requestor = await UserModel.findById(response?.createdBy);
    send(
      "",
      requestor?.email,
      "Your Purchase request was rejected",
      "",
      "",
      "rejection"
    );

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

    await RequestModel.findByIdAndUpdate(id, { $set: update });

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

    if(newStatus === 'approved (fd)'){
      let level3Approvers = await UserModel.find({
        "permissions.canApproveAsPM": true,
      });
      let approversEmails = level3Approvers?.map((l3)=>{
        return l3?.email
      })
      send(
        "",
        approversEmails,
        "Purchase request approval",
        "",
        "",
        "approval"
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

export async function updateRequest(id: String, update: Request) {
  try {
    await RequestModel.findByIdAndUpdate(id, update);
    return { message: "done" };
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
