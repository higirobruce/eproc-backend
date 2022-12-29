import { Types } from "mongoose";
import { IUser } from "../interfaces/iUsers";
import { UserType, UserStatus } from "../types/types";


export class User implements IUser {
    userType: UserType;
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    experienceDurationInYears: number | null;
    experienceDurationInMonths: number | null;
    webSite: string;
    status: UserStatus;
    password: string;
    createdOn: Date;
    createdBy: Types.ObjectId;
    rating: number;
    tin: number;
    companyName: string;
    companyEmail: string;
    nid: string;
    passport: string;
    number: number;
    notes: string;
    department: Types.ObjectId;
    
    constructor(
        userType: UserType,
        firstName: string,
        lastName: string,
        email: string,
        telephone: string,
        experienceDurationInYears: number | null,
        experienceDurationInMonths: number | null,
        webSite: string,
        status: UserStatus,
        password: string,
        createdOn: Date,
        createdBy: string,
        rating: number,
        tin: number,
        companyName: string,
        companyEmail: string,
        nid: string,
        passport: string,
        number: number,
        notes: string,
        department: string
    ) {
        this.userType = userType;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.telephone = telephone;
        this.experienceDurationInYears = experienceDurationInYears;
        this.experienceDurationInMonths = experienceDurationInMonths;
        this.webSite = webSite;
        this.status = status;
        this.password = password;
        this.createdOn = createdOn;
        this.createdBy = createdBy ? new Types.ObjectId(createdBy) : new Types.ObjectId();
        this.rating = rating;
        this.tin = tin;
        this.companyName = companyName;
        this.companyEmail = companyEmail;
        this.nid = nid;
        this.passport = passport
        this.number = number
        this.notes = notes
        this.department = department? new Types.ObjectId(department) : new Types.ObjectId(); 
    }


}