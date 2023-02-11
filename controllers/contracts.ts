import { Contract } from "../classrepo/contracts";
import { ContractModel } from "../models/contracts";


export async function getAllContracts(){
    let contracts = await ContractModel.find();
    return contracts;
}

export async function saveContract(contract:Contract){
    await ContractModel.create(contract);
}

export async function getContractByTenderId(tenderId: String) {
    let pos = await ContractModel.find({ tender: tenderId }).populate('tender').populate('vendor').populate('createdBy').populate({
        path: "tender",
        populate: {
            path: 'purchaseRequest',
            model: 'Request'
        }
    });
    return pos;
}

export async function getContractByVendorId(vendorId: String) {
    let pos = await ContractModel.find({ vendor: vendorId }).populate('tender').populate('vendor').populate('createdBy');
    return pos;
}

