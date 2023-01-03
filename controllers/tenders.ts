import { Request } from "../classrepo/requests";
import { Tender } from "../classrepo/tenders";
import { TenderModel } from "../models/tenders";

export async function getAllTenders() {
    let reqs = await TenderModel.find().populate('createdBy').populate({
        path: "createdBy", 
        populate: {
            path:'department',
            model:'Department'
        }
    })
    return reqs
}

export async function saveTender(tender: Tender) {
    let newTender = await TenderModel.create(tender);
    return newTender._id;
}


export async function updateTenderStatus(id: String, newStatus: String) {
    try {
        await TenderModel.findByIdAndUpdate(id, { $set: { status: newStatus } })
        return { message: 'done' }
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}