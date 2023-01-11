

import { BidSubmission } from "../classrepo/bidSubmissions";
import { BidSubmissionModel } from "../models/bidSubmissions";

export async function getAllBidSubmissions() {
    let reqs = await BidSubmissionModel.find().populate('createdBy').populate({
        path: "createdBy",
        populate: {
            path: 'department',
            model: 'Department'
        }
    }).populate('tender')
    return reqs
}

export async function getAllBidSubmissionsByTender(tenderId: String) {
    let reqs = await BidSubmissionModel.find({ tender: tenderId }).populate('createdBy').populate({
        path: "createdBy",
        populate: {
            path: 'department',
            model: 'Department'
        }
    }).populate('tender')
    return reqs
}

export async function iSubmittedOnTender(tenderId: string, vendorId: any) {
    let reqs = await BidSubmissionModel.find({ tender: tenderId, createdBy: vendorId })
    return reqs.length > 0;
}

export async function saveBidSubmission(submission: BidSubmission) {
    let newSubmission = await BidSubmissionModel.create(submission);
    return newSubmission;
}


export async function selectSubmission(id: String) {
    try {
        await BidSubmissionModel.findByIdAndUpdate(id, { $set: { status: "selected" } })
        return { message: 'done' }
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}

export async function rejectOtherSubmissions(tenderId: any) {
    try {
        await BidSubmissionModel.updateMany({ status: { $ne: 'selected' }, tender: tenderId }, { $set: { status: 'rejected' } })
        return { message: 'done' }
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}

export async function rejectSubmission(id: String) {
    try {
        await BidSubmissionModel.findByIdAndUpdate(id, { $set: { status: "rejected" } })
        return { message: 'done' }
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}

export async function updateSubmissionStatus(id: String, newStatus: String) {
    try {
        await BidSubmissionModel.findByIdAndUpdate(id, { $set: { status: newStatus } })
        return { message: 'done' }
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}