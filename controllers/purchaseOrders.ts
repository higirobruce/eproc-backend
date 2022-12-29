import { PurchaseOrder } from "../classrepo/purchaseOrders";
import { PurchaseOrderModel } from "../models/purchaseOrders";


export async function getAllPOs() {
    let pos = await PurchaseOrderModel.find();

    return pos;
}


export async function savePO(po: PurchaseOrder) {
    try { await PurchaseOrderModel.create(po); return 'Done' }
    catch (err) {
        throw err
    }

}