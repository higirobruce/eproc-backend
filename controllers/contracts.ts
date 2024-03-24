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
  let pos: any;
  let totalPages: any;
  let query = {};

  if (status === "all") query = {};
  else query = { status };

  const contractQuery = ContractModel.find(query)
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
