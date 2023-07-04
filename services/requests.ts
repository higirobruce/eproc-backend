import { RequestModel } from "../models/requests";

export const generateReqNumber = async () => {
    // Get the last saved document
    const lastDocument = await RequestModel.findOne().sort({ number: -1 });
    // Generate a new 10-digit number, starting from 1000000000 and incrementing by 1
    let newNumber = 1000000;
    if (lastDocument && lastDocument.number) {
        newNumber = lastDocument.number + 1;
    }
    

    // Return the new number
    return newNumber;
}