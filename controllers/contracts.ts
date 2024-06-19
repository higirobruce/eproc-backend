import { Contract } from "../classrepo/contracts";
import { ContractModel } from "../models/contracts";

/**
 * Get all contracts in the database. This is used to populate the list of contracts when creating a new invoice.
 *
 *
 * @return { Promise } A promise that resolves with an array of ContractModel instances. Each ContractModel is populated with vendor tender and request
 */
export async function getAllContracts() {
  let contracts = await ContractModel.find()
    .populate("vendor")
    .populate("tender")
    .populate("request")
    .populate("createdBy")
    .populate({
      path: "tender",
      populate: {
        path: "purchaseRequest",
        model: "Request",
      },
    })
    .sort({ number: -1 });
  return contracts;
}

/**
 * Saves a contract to the database. This is a convenience method for use in unit tests. It will create a new contract if it does not exist and update any fields that are not provided by the user.
 *
 * @param contract - The contract to save. Must be validated before being saved.
 * @param Contract
 *
 * @return { Promise } Resolves with the newly created contract or rejects with an error message if there was a problem
 */
export async function saveContract(contract: Contract) {
  return await ContractModel.create(contract);
}

/**
 * Get a contract by tender id. This is used to create a purchase request and get the contract from the database
 *
 * @param tenderId - The id of the tender
 * @param String
 *
 * @return { Promise } The contract as an object with fields for the tender request vendor createdBy and request
 */
export async function getContractByTenderId(tenderId: String) {
  let pos = await ContractModel.find({ tender: tenderId })
    .populate("tender")
    .populate("request")
    .populate("vendor")
    .populate("createdBy")
    .populate({
      path: "tender",
      populate: {
        path: "purchaseRequest",
        model: "Request",
      },
    });
  return pos;
}

export async function getContractByRequestId(requestId: String) {
  let pos = await ContractModel.find({ request: requestId })
    .populate("tender")
    .populate("request")
    .populate("vendor")
    .populate("createdBy")
    .populate({
      path: "tender",
      populate: {
        path: "purchaseRequest",
        model: "Request",
      },
    })
    .sort({ number: -1 });
  return pos;
}

export async function getContractById(id: String) {
  let pos = await ContractModel.findById(id)
    .populate("tender")
    .populate("request")
    .populate("vendor")
    .populate("createdBy")
    .populate({
      path: "tender",
      populate: {
        path: "purchaseRequest",
        model: "Request",
      },
    })
    .sort({ number: -1 });
  return pos;
}

export async function getContractByStatus(req: any, status: String) {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const search = req.query.search;
  let pos: any;
  let totalPages: any;
  let query = {};

  console.log("Seeearrr", search);
  let pipeline: any = [
    {
      $addFields: {
        numberAsString: {
          $toString: "$number",
        },
      },
    },
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
              preserveNullAndEmptyArrays: true,
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
  ];

  if (status === "all") query = { $match: {} };
  else
    query = {
      $match: {
        status: status,
      },
    };

  pipeline.unshift(query);

  if (search) {
    pipeline.push({
      $match: {
        $or: [
          // { numberAsString: { $regex: search, $options: "i" } },
          { "vendor.companyName": { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  let contractQuery = await ContractModel.aggregate(pipeline).sort({
    number: -1,
  });

  totalPages = contractQuery.length;

  if (pageSize && currentPage) {
    pipeline.push({
      $skip: pageSize * (currentPage - 1),
    });
    pipeline.push({
      $limit: pageSize,
    });
  }

  contractQuery = await ContractModel.aggregate(pipeline).sort({
    number: -1,
  });

  return { data: contractQuery, totalPages: totalPages };
}

export async function getContractByVendorId(
  vendorId: String,
  status: String,
  req: any
) {
  let query = {};
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let totalPages: any;
  let pos: any;
  if (status === "all") query = { vendor: vendorId };
  else query = { vendor: vendorId, status: status };
  let contractQuery = ContractModel.find(query)
    .populate("tender")
    .populate("request")
    .populate("vendor")
    .populate("createdBy")
    .populate({
      path: "tender",
      populate: {
        path: "purchaseRequest",
        model: "Request",
      },
    })
    .sort({ number: -1 });

  totalPages = await contractQuery;

  if (pageSize && currentPage) {
    contractQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  pos = await contractQuery.clone();

  return { data: pos, totalPages: totalPages?.length };
}

export async function updateContract(id: String, contract: Contract) {
  let newContract = await ContractModel.findByIdAndUpdate(id, contract, {
    new: true,
  });

  // if (newContract?.status === "reviewed") {
  //   let internallyNotSigned = await ContractModel.find({
  //     "signatories.onBehalfOf": "Irembo Ltd",
  //     "signatories.signed": false,
  //     tender: "640ad9b09058d32c4efacc15",
  //   });

  //   if(internallyNotSigned.length===0){

  //   }
  // }
  return newContract;
}

export async function getContractsTotalAnalytics(year: any) {
  if (!year) {
    year = "2024";
  }
  let pipeline = [
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
      $addFields: {
        currency: "$request.currency",
      },
    },
    {
      $lookup: {
        from: "exchangerates",
        let: {
          month: {
            $month: "$createdAt",
          },
          year: {
            $year: "$createdAt",
          },
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $ne: ["$currency", "RWF"],
                  },
                  {
                    $eq: [
                      {
                        $month: "$Date",
                      },
                      "$$month",
                    ],
                  },
                  {
                    $eq: [
                      {
                        $year: "$Date",
                      },
                      "$$year",
                    ],
                  },
                ],
              },
            },
          },
        ],
        as: "exchangeRates",
      },
    },
    {
      $unwind: "$exchangeRates",
    },
    {
      $addFields: {
        amount: {
          $cond: [
            {
              $ne: ["$currency", "RWF"],
            },
            {
              $multiply: ["$amount", "$exchangeRates.Open"],
            },
            "$amount",
          ],
        },
      },
    },
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
        contracts: {
          $sum: 1,
        },
      },
    },
  ];

  let req = await ContractModel.aggregate(pipeline).sort({ _id: 1 });
  return req;
}

export async function getContractStatusAnalytics(year: any) {
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

  let req = await ContractModel.aggregate(pipeline);
  return req;
}

export async function getTotalNumberOfContracts(year: any) {
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

  let count = await ContractModel.aggregate(pipeline);
  if (count?.length >= 1) return count[0]?.total_records;
  else return 0;
  // return count;
}

export async function getContractLeadTime(year: any) {
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

  let req = await ContractModel.aggregate(pipeline);
  return req;
}
