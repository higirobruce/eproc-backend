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
    });
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

/**
 * Get a contract by vendor id. This is used to create a list of contract in order to display the list
 *
 * @param vendorId - Vendor id of the contract
 * @param String
 *
 * @return { Promise } The contract with the id specified in the vendorId as the first parameter. If no contract is found an empty Promise is
 */
export async function getContractByVendorId(vendorId: String) {
  let pos = await ContractModel.find({ vendor: vendorId })
    .populate("tender")
    .populate("tender")
    .populate("vendor")
    .populate("createdBy");
  return pos;
}

export async function updateContract(id: String, contract: Contract) {
  return await ContractModel.findByIdAndUpdate(
    id,
    contract,
    { new: true }
  );
}
