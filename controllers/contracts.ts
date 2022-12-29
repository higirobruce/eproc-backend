import { Contract } from "../classrepo/contracts";
import { ContractModel } from "../models/contracts";


export async function getAllContracts(){
    let contracts = await ContractModel.find();
    return contracts;
}

export async function saveContract(contract:Contract){
    await ContractModel.create(contract);
}