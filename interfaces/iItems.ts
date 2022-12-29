import mongoose from "mongoose";

export interface iItem {
    number: number,
    description: string,
    termsOfReference: string,
    availableQuantity: number,
    unitPurchasingPrice: number,
    unitSellingPrice:number,
    minStock: number,
    purchaseBeforeDays: number
}

export interface iItemDocument extends iItem, mongoose.Document {

}