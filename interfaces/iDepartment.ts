import mongoose from "mongoose";

export interface iDepartment {
    number: number,
    description: string
}

export interface iDepartmentDocument extends iDepartment, mongoose.Document {

}