import { Document, Types } from 'mongoose';
import { UserStatus, UserType } from '../types/types';


export interface IUser {
    userType: UserType,
    contactPersonNames: string,
    companyName: string,
    email: string,
    title: string,
    hqAddress: string,
    country: string,
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
    passportNid: string,
    number: number,
    notes: string,
    services: Array<string>,
    permissions: Object,
    rdbCertId: String,
    vatCertId: String,
    firstName: String,
    lastName: String,
    tempEmail: String,
    tempPassword: String

}


export interface IUserDocument extends IUser, Document {
    department: {
        type: Types.ObjectId,
        ref: 'Department'
    }
}