import { Types } from "mongoose";
import { IUser } from "../interfaces/iUsers";
import { UserType, UserStatus } from "../types/types";


export class User implements IUser {
    userType: UserType;
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
    number: number;
    notes: string;
    department: Types.ObjectId;
    contactPersonNames: string;
    title: string;
    hqAddress: string;
    country: string;
    passportNid: string;
    services: string[];
    permissions: Object;
    rdbCertId: String;
    vatCertId: String;
    bankName: String;
    bankAccountNumber: String;
    

    constructor(
        userType: UserType,
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
        number: number,
        notes: string,
        department: string,
        contactPersonNames: string,
        title: string,
        hqAddress: string,
        country: string,
        passportNid: string,
        services: string[],
        permissions: Object,
        rdbCertId: string,
        vatCertId: string,
        bankName: string,
        bankAccountNumber: string
    ) {
        this.userType = userType;
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
        this.number = number
        this.notes = notes
        this.department = department ? new Types.ObjectId(department) : new Types.ObjectId();
        this.contactPersonNames = contactPersonNames
        this.title = title
        this.hqAddress = hqAddress
        this.country = country
        this.passportNid = passportNid
        this.services = services
        this.permissions = permissions
        this.rdbCertId = rdbCertId
        this.vatCertId = vatCertId
        this.bankName= bankName
        this.bankAccountNumber = bankAccountNumber

    }
    
    



}