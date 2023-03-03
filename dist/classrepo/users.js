"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
class User {
    constructor(userType, email, telephone, experienceDurationInYears, experienceDurationInMonths, webSite, status, password, createdOn, createdBy, rating, tin, companyName, number, notes, department, contactPersonNames, title, hqAddress, country, passportNid, services, permissions, rdbCertId, vatCertId, bankName, bankAccountNumber) {
        this.userType = userType;
        this.email = email;
        this.telephone = telephone;
        this.experienceDurationInYears = experienceDurationInYears;
        this.experienceDurationInMonths = experienceDurationInMonths;
        this.webSite = webSite;
        this.status = status;
        this.password = password;
        this.createdOn = createdOn;
        this.createdBy = createdBy ? new mongoose_1.Types.ObjectId(createdBy) : new mongoose_1.Types.ObjectId();
        this.rating = rating;
        this.tin = tin;
        this.companyName = companyName;
        this.number = number;
        this.notes = notes;
        this.department = department ? new mongoose_1.Types.ObjectId(department) : new mongoose_1.Types.ObjectId();
        this.contactPersonNames = contactPersonNames;
        this.title = title;
        this.hqAddress = hqAddress;
        this.country = country;
        this.passportNid = passportNid;
        this.services = services;
        this.permissions = permissions;
        this.rdbCertId = rdbCertId;
        this.vatCertId = vatCertId;
        this.bankName = bankName;
        this.bankAccountNumber = bankAccountNumber;
    }
}
exports.User = User;
