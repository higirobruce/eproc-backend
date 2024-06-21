import moment from "moment";
import { Request } from "../classrepo/requests";
import { Tender } from "../classrepo/tenders";
import { RequestModel } from "../models/requests";
import { TenderModel } from "../models/tenders";
import { UserModel } from "../models/users";
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
    .populate("purchaseRequest")
    .sort({ number: -1 });
  return reqs;
}

export async function getAllTendersByStatus(status: String) {
  let _status =
    status == "open"
      ? { submissionDeadLine: { $gt: Date.now() }, status: { $ne: "closed" } }
      : { submissionDeadLine: { $lt: Date.now() } };
  let reqs = await TenderModel.find(_status)
    .populate("createdBy")
    .populate({
      path: "createdBy",
      populate: {
        path: "department",
        model: "Department",
      },
    })
    .populate("purchaseRequest")
    .sort({ number: -1 });
  return reqs;
}

export async function getTendersById(id: String) {
  let req = await TenderModel.findById(id)
    .populate("createdBy")
    .populate({
      path: "createdBy",
      populate: {
        path: "department",
        model: "Department",
      },
    })
    .populate("purchaseRequest")
    .sort({ number: -1 });
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
    .populate("purchaseRequest")
    .sort({ number: -1 });
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
    // {
    //   $sort:
    //     /**
    //      * Provide any number of field/order pairs.
    //      */
    //     {
    //       number: -1,
    //     },
    // },
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

  let reqs = await TenderModel.aggregate(pipeline).sort({ number: -1 });

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
    .populate("purchaseRequest")
    .sort({ number: -1 });
  return reqs;
}

export async function getClosedTenders() {
  let reqs = await TenderModel.find({
    $or: [{ status: "closed" }, { status: { $ne: "open" } }],
  })
    .populate("createdBy")
    .populate({
      path: "createdBy",
      populate: {
        path: "department",
        model: "Department",
      },
    })
    .sort({ number: -1 });
  return reqs;
}

export async function saveTender(tender: Tender) {
  let newTender = await TenderModel.create(tender);
  let request = tender.purchaseRequest;
  let category = (await RequestModel.findById(request))?.serviceCategory;

  console.log("Category ", category);

  // //Send notifications to vendors in the tender's caterogry
  let vendors;

  if (category == "Others") {
    vendors = await UserModel.find({
      status: { $eq: "approved" },
      userType: "VENDOR",
    });
  } else {
    vendors = await UserModel.find({
      services: { $elemMatch: { $eq: category } },
      status: { $eq: "approved" },
      userType: "VENDOR",
    });
  }

  let vendorEmails = vendors?.map((v) => {
    return v?.email;
  });
  if (vendorEmails?.length >= 1) {
    send(
      "",
      vendorEmails,
      "New Tender Notice",
      JSON.stringify(newTender),
      "",
      "newTender"
    );
  }
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
      { new: true }
    )
      .populate("createdBy")
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
    // return {
    //   error: true,
    //   errorMessage: `Error :${err}`,
    // };
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

export async function getTendersTotalAnalytics(year: any, currency: any) {
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
        // type:"tenders",
        tenders: {
          $sum: 1,
        },
      },
    },
  ];

  let req = await TenderModel.aggregate(pipeline).sort({ _id: 1 });
  return req;
}

export async function getTenderStatusAnalytics(year: any, currency: any) {
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

  let req = await TenderModel.aggregate(pipeline);
  return req;
}
