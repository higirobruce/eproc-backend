import { Document, Types } from 'mongoose';
import { UserStatus, UserType } from '../types/types';


export interface IUser {
    userType: UserType,
    firstName: string,
    lastName: string,
    companyName: string,
    email: string,
    companyEmail: string,
    telephone: string,
    experienceDurationInYears: number | null,
    experienceDurationInMonths: number | null,
    webSite: string,
    status: UserStatus,
    password: string,
    createdOn: Date,
    createdBy: Types.ObjectId,
    rating: number,
    tin: number,
    nid: string,
    passport: string,
    number: number,
    notes: string

}


export interface IUserDocument extends IUser, Document {
    department: {
        type: Types.ObjectId,
        ref: 'Department'
    }
}