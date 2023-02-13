import { User } from "../classrepo/users";
import { UserModel } from "../models/users";
import { sapLogin, SESSION_ID } from "../utils/sapB1Connection";

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
        let users = await UserModel.find({ userType: "VENDOR" }).populate('department');
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
        let users = await UserModel.find({ userType: { $ne: "VENDOR" } }).populate('department');
        return users;
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}

export async function createSupplierinB1() {
    
    let options = {
        // "CardCode": "SA0003",
        "CardName": "Aline1",
        "CardType": "cSupplier",
        "Series": 98
    };
    
    fetch('https://192.168.20.181:50000/b1s/v1/BusinessPartners', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Cookie': 'B1SESSION=e0e4b6de-aa10-11ed-8000-000c29f945cd; ROUTEID=.node5; SESSION=e0e4b6de-aa10-11ed-8000-000c29f945cd'
        },
        body: JSON.stringify(
            options
        )
    }).then(res => res.json())
        .then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
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
        await UserModel.findByIdAndUpdate(id, { $set: { status: "approved" } }).populate('department');
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