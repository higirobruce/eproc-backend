import { PurchaseOrder } from "../classrepo/purchaseOrders";
import { PurchaseOrderModel } from "../models/purchaseOrders";


export async function getAllPOs() {
    let pos = await PurchaseOrderModel.find().populate('tender').populate('vendor').populate('createdBy').populate({
        path: "tender",
        populate: {
            path: 'purchaseRequest',
            model: 'Request'
        }
    })
    return pos;
}

export async function getPOByTenderId(tenderId: String) {
    let pos = await PurchaseOrderModel.find({ tender: tenderId }).populate('tender').populate('vendor').populate('createdBy').populate({
        path: "tender",
        populate: {
            path: 'purchaseRequest',
            model: 'Request'
        }
    });
    console.log(tenderId, pos)
    return pos;
}

export async function getPOByVendorId(vendorId: String) {
    let pos = await PurchaseOrderModel.find({ vendor: vendorId }).populate('tender').populate('vendor').populate('createdBy');
    return pos;
}



export async function updatePOStatus(id: String, newStatus: String) {
    try {
        await PurchaseOrderModel.findByIdAndUpdate(id, { $set: { status: newStatus } })
        return { message: 'done' }
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}

export async function updateProgress(id: String, progress: String) {
    try {
        let a = await PurchaseOrderModel.findByIdAndUpdate(id, { $set: { deliveryProgress: progress } }, { returnOriginal: false })
        return a
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}


export async function savePO(po: PurchaseOrder) {
    try { let createdRecord = await PurchaseOrderModel.create(po); return createdRecord }
    catch (err) {
        throw err
    }

}