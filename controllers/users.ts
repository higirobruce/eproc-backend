import { User } from "../classrepo/users";
import { UserModel } from "../models/users";

export async function getAllUsers() {
    try {
        let users = await UserModel.find().populate('department');
        return users;
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}

export async function getAllVendors() {
    try {
        let users = await UserModel.find({ userType: "VENDOR" });
        return users;
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}

export async function getAllInternalUsers() {
    try {
        let users = await UserModel.find({ userType: { $ne: "VENDOR" } });
        return users;
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}

export async function saveUser(user: User) {
    try {

        let createdUser = await UserModel.create(user)
        return createdUser._id
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}

export async function getUserByEmail(userEmail: String) {
    let user = await UserModel.findOne({ email: userEmail });
    return user;
}

export async function approveUser(id: String) {
    try {
        await UserModel.findByIdAndUpdate(id, { $set: { status: "approved" } })
        return { message: 'done' }
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}

export async function declineUser(id: String) {
    try {
        await UserModel.findByIdAndUpdate(id, { $set: { status: "declined" } })
        return { message: 'done' }
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}