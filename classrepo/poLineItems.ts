import mongoose from "mongoose";

export class PoLineItem {
    itemId: mongoose.Types.ObjectId
    quantity: number
    estimatedUnitCost: number
    currency: string
    description: string
    techSpecs: string
    tors: string
    referenceLinks: string[]
    budgetLine: string
    budgeted: boolean
    lineOfBusiness: string


    constructor(
        itemId: string,
        quantity: number,
        estimatedUnitCost: number,
        currency: string,
        description: string,
        techSpecs: string,
        tors: string,
        referenceLinks: string[],
        budgetLine: string,
        budgeted: boolean,
        lineOfBusiness: string
    ) {
        this.itemId = itemId ? new mongoose.Types.ObjectId(itemId) : new mongoose.Types.ObjectId()
        this.quantity = quantity
        this.estimatedUnitCost = estimatedUnitCost
        this.currency = currency
        this.description = description
        this.techSpecs = techSpecs
        this.tors = tors
        this.referenceLinks = referenceLinks
        this.budgetLine = budgetLine
        this.budgeted = budgeted
        this.lineOfBusiness = lineOfBusiness
    }
}
