import { Request } from "../classrepo/requests";
import { RequestModel } from "../models/requests";

export async function getAllRequests() {
    let reqs = await RequestModel.find().populate('createdBy').populate({
        path: "createdBy",
        populate: {
            path: 'department',
            model: 'Department'
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

export async function declineRequest(id: String, reason: String, declinedBy: String) {
    try {
        await RequestModel.findByIdAndUpdate(id, { $set: { status: "declined", reasonForRejection: reason, declinedBy: declinedBy } })
        return { message: 'done' }
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}

export async function updateRequestStatus(id: String, newStatus: String) {
    try {
        await RequestModel.findByIdAndUpdate(id, { $set: { status: newStatus, approvalDate: Date.now() } })
        return { message: 'done' }
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}

export async function getReqCountsByDepartment() {
    let lookup = [
        {
            '$lookup': {
                'from': 'users',
                'localField': 'createdBy',
                'foreignField': '_id',
                'as': 'createdBy'
            }
        }, {
            '$unwind': {
                'path': '$createdBy',
                'includeArrayIndex': 'string',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$lookup': {
                'from': 'departments',
                'localField': 'createdBy.department',
                'foreignField': '_id',
                'as': 'department'
            }
        }, {
            '$unwind': {
                'path': '$department',
                'includeArrayIndex': 'string',
                'preserveNullAndEmptyArrays': false
            }
        }, {
            '$group': {
                '_id': '$department.description',
                'totalCount': {
                    '$count': {}
                }
            }
        }
    ];

    let result = await RequestModel.aggregate(lookup)

    return result
}