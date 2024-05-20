import mongoose from "mongoose";

export interface iDepartment {
    number: number,
    description: string,
    visible: boolean
}

export interface iDepartmentDocument extends iDepartment, mongoose.Document {

}