"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
class User {
    constructor(userType, firstName, lastName, email, telephone, experienceDurationInYears, experienceDurationInMonths, webSite, status, password, createdOn, createdBy, rating, tin, companyName, companyEmail, nid, passport, number, notes, department) {
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
        this.createdBy = createdBy ? new mongoose_1.Types.ObjectId(createdBy) : new mongoose_1.Types.ObjectId();
        this.rating = rating;
        this.tin = tin;
        this.companyName = companyName;
        this.companyEmail = companyEmail;
        this.nid = nid;
        this.passport = passport;
        this.number = number;
        this.notes = notes;
        this.department = department ? new mongoose_1.Types.ObjectId(department) : new mongoose_1.Types.ObjectId();
    }
}
exports.User = User;
