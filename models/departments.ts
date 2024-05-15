
import { IUserDocument } from '../interfaces/iUsers';
import mongoose, { Schema, model, connect, Document, Types } from 'mongoose';
import { iDepartment } from '../interfaces/iDepartment';

export const DepartmentSchema = new Schema<iDepartment>({
   
    number: {
        type: Number, unique: true,
        dropDups: true,
    },
    description: {
        type: String, unique: true,
        dropDups: true,
    },
    visible:{
        type: Boolean,
        default: false,
    }
},{timestamps: true})

export const DepartmentModel = model<iDepartment>('Department', DepartmentSchema);