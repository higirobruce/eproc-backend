import { User } from "../classrepo/users";
import { UserModel } from "../models/users";
import { sapLogin, SESSION_ID } from "../utils/sapB1Connection";
import { getSeriesByDescription } from "./series";

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

export async function createSupplierinB1(CardName: String, CardType: String, Series: any) {

    let options = {
        // "CardCode": "SA0003",
        CardName,
        CardType,
        Series
    };

    fetch('https://192.168.20.181:50000/b1s/v1/BusinessPartners', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Cookie': 'B1SESSION=12b28ebc-ac5e-11ed-8002-000c29f945cd; ROUTEID=.node2; SESSION=12b28ebc-ac5e-11ed-8002-000c29f945cdß'
        },
        body: JSON.stringify(
            options
        )
    }).then(res => res.json())
        .then( res => {
            return res?.CardCode
        }).catch(err => {
            console.log(err)
        })
}

export async function getB1SeriesFromNames(entityName:String){
    let firstChar = entityName.substring(0,1).toUpperCase();
    // let secondChar = lastName.substring(0,1).toUpperCase();
    let series = await getSeriesByDescription(`S${firstChar}`)
    return series;
}


export async function saveUser(user: User) {
    try {
        let name = user.companyName
        let series = await getB1SeriesFromNames(name)
        let createdCode = await createSupplierinB1(name,'cSupplier',series)
        console.log(createdCode)
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