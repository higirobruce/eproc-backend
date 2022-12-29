
import { ContractModel } from "../models/contracts";

export const generateContractNumber = async () => {
    // Get the last saved document
    const lastDocument = await ContractModel.findOne().sort({number: -1});
    // Generate a new 10-digit number, starting from 1000000000 and incrementing by 1
    let newNumber = 2000000000;
    if (lastDocument && lastDocument.number) {
      newNumber = lastDocument.number + 1;
    }
    
    // Return the new number
    return newNumber;
  }
  