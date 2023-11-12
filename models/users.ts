import { IUserDocument } from "./../interfaces/iUsers";
import mongoose, { Schema, model, connect, Document, Types } from "mongoose";
import crypto from "crypto";

export const UserSchema = new Schema<IUserDocument>({
  userType: {
    type: String,
    defaul: "VENDOR",
  },
  contactPersonNames: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  },
  telephone: {
    type: String,
  },
  experienceDurationInYears: {
    type: Number,
  },
  experienceDurationInMonths: {
    type: Number,
  },
  webSite: {
    type: String,
  },
  status: {
    type: String,
    default: "pending-approval",
  },
  password: {
    type: String,
  },
  createdOn: { type: Date, default: Date.now() },
  createdBy: Types.ObjectId,
  rating: {
    type: Number,
  },
  tin: {
    type: Number,
  },
  number: {
    type: Number,
    unique: true,
    dropDups: true,
  },
  passportNid: {
    type: String,
  },
  hqAddress: {
    type: String,
  },
  country: {
    type: String,
  },
  notes: {
    type: String,
  },
  department: {
    type: Types.ObjectId,
    ref: "Department",
  },
  companyName: {
    type: String,
    unique: true,
  },
  services: Array,
  permissions: {
    type: Object,
    default: {}
  },
  title: {
    type: String,
  },
  rdbCertId: {
    type: String,
  },
  vatCertId: {
    type: String,
  },
  lastName: {
    type: String,
  },
  firstName: {
    type: String,
  },
  tempEmail:{
    type: String
  },
  tempPassword:{
    type: String
  },
  sapCode:{
    type: String,
    default: ''
  }
},{timestamps: true});


// Method to set salt and hash the password for a user
UserSchema.methods.setPassword = function (password: any) {
  // Creating a unique salt for a particular user
  this.salt = crypto.randomBytes(16).toString("hex");

  // Hashing user's salt and password with 1000 iterations,

  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`);
};

// Method to check the entered password is correct or not
UserSchema.methods.validPassword = function (password: any) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`);
  return this.hash === hash;
};

export const UserModel = model<IUserDocument>("User", UserSchema);
