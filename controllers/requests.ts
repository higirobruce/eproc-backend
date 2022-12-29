import { Request } from "../classrepo/requests";
import { RequestModel } from "../models/requests";

export async function getAllRequests() {
    let reqs = await RequestModel.find().populate('createdBy').populate({
        path: "createdBy", 
        populate: {
            path:'department',
            model:'Department'
        }
    })
    return reqs
}

export async function saveRequest(request: Request) {
    let newReq = await RequestModel.create(request);
    return newReq._id;
}


export async function approveRequest(id: String) {
    try {
        await RequestModel.findByIdAndUpdate(id, { $set: { status: "approved" } })
        return { message: 'done' }
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}

export async function declineRequest(id: String) {
    try {
        await RequestModel.findByIdAndUpdate(id, { $set: { status: "declined" } })
        return { message: 'done' }
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}