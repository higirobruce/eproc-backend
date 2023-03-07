import { Request } from "../classrepo/requests";
import { Tender } from "../classrepo/tenders";
import { TenderModel } from "../models/tenders";
import { send } from "../utils/sendEmailNode";

export async function getAllTenders() {
  let reqs = await TenderModel.find()
    .populate("createdBy")
    .populate({
      path: "createdBy",
      populate: {
        path: "department",
        model: "Department",
      },
    })
    .populate("purchaseRequest");
  return reqs;
}

export async function getTendersById(id: String) {
  let req = await TenderModel.findById({id })
    .populate("createdBy")
    .populate({
      path: "createdBy",
      populate: {
        path: "department",
        model: "Department",
      },
    })
    .populate("purchaseRequest");
  return req;
}

export async function getTendersByRequest(requestId: String) {
    let reqs = await TenderModel.find({ purchaseRequest: requestId })
      .populate("createdBy")
      .populate({
        path: "createdBy",
        populate: {
          path: "department",
          model: "Department",
        },
      })
      .populate("purchaseRequest");
    return reqs;
  }

export async function getTendersByServiceCategoryList(serviceCategories: []) {
  let pipeline = [
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
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $lookup: {
        from: "departments",
        localField: "createdBy.department",
        foreignField: "_id",
        as: "createdBy.department",
      },
    },
    {
      $unwind: {
        path: "$createdBy.department",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $match: {
        "purchaseRequest.serviceCategory": {
          $in: serviceCategories,
        },
      },
    },
  ];
  // let reqs = await TenderModel.find({ purchaseRequest: requestId }).populate('createdBy').populate({
  //     path: "createdBy",
  //     populate: {
  //         path: 'department',
  //         model: 'Department'
  //     }
  // }).populate('purchaseRequest')

  let reqs = await TenderModel.aggregate(pipeline);
  return reqs;
}

export async function getOpenTenders() {
  let reqs = await TenderModel.find({ status: "open" })
    .populate("createdBy")
    .populate({
      path: "createdBy",
      populate: {
        path: "department",
        model: "Department",
      },
    })
    .populate("purchaseRequest");
  return reqs;
}

export async function getClosedTenders() {
  let reqs = await TenderModel.find({ status: "closed" })
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

export async function saveTender(tender: Tender) {
  let newTender = await TenderModel.create(tender);
  return newTender;
}

export async function updateTenderStatus(id: String, newStatus: String) {
  try {
    await TenderModel.findByIdAndUpdate(id, { $set: { status: newStatus } });
    return { message: "done" };
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function updateTender(id: String, newTender: Tender) {
  try {
    let updatedTender = await TenderModel.findOneAndUpdate(
      { _id: id },
      newTender,
      { new:true }
    ).populate("createdBy")
    .populate({
      path: "createdBy",
      populate: {
        path: "department",
        model: "Department",
      },
    })
    .populate("purchaseRequest");
    return updatedTender;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function getTendCountsByDepartment() {
  let lookup = [
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
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "purchaseRequest.createdBy",
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

  let result = await TenderModel.aggregate(lookup);

  return result;
}

export async function getTendCountsByCategory() {
  let lookup = [
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
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "purchaseRequest.createdBy",
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
        _id: "$purchaseRequest.serviceCategory",
        totalCount: {
          $count: {},
        },
      },
    },
  ];

  let result = await TenderModel.aggregate(lookup);

  return result;
}
