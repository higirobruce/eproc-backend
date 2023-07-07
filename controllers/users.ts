import { User } from "../classrepo/users";
import { UserModel } from "../models/users";
import { sapLogin, SESSION_ID } from "../utils/sapB1Connection";
import { getSeriesByDescription } from "./series";
import { LocalStorage } from "node-localstorage";
import {
  generatePassword,
  hashPassword,
  validPassword,
} from "../services/users";
import { send } from "../utils/sendEmailNode";
import mongoose from "mongoose";

let localstorage = new LocalStorage("./scratch");

export async function getAllUsers() {
  
  try {
    let users = await UserModel.find()
      .populate("department")
      .sort({ email: "asc" });

    return users;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function getUser(id: string) {
  
  try {
    let users = await UserModel.findById(id)

    return users;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}


export async function getAllVendors() {
  try {
    let pipeline = [
      {
        $match: {
          userType: "VENDOR",
        },
      },
      {
        $lookup: {
          from: "purchaseorders",
          localField: "_id",
          foreignField: "vendor",
          as: "purchaseorders",
        },
      },
      {
        $unwind: {
          path: "$purchaseorders",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          avgRate: {
            $avg: "$purchaseorders.rate",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "vendor",
        },
      },
      {
        $unwind: {
          path: "$vendor",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          "vendor.avgRate": "$avgRate",
        },
      },
    ];
    let users = await UserModel.find({ userType: "VENDOR" })
      .populate("department")
      .sort({ createdOn: "desc" });

    let usersAggregate = await UserModel.aggregate(pipeline).sort({
      createdOn: "desc",
    });
    return usersAggregate;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function getVendorById(id: string) {
  try {
    let pipeline = [
      {
        $match: {
          userType: "VENDOR",
          _id: new mongoose.mongo.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "purchaseorders",
          localField: "_id",
          foreignField: "vendor",
          as: "purchaseorders",
        },
      },
      {
        $unwind: {
          path: "$purchaseorders",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          avgRate: {
            $avg: "$purchaseorders.rate",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "vendor",
        },
      },
      {
        $unwind: {
          path: "$vendor",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          "vendor.avgRate": "$avgRate",
        },
      },
    ];
    let users = await UserModel.find({ userType: "VENDOR" })
      .populate("department")
      .sort({ createdOn: "desc" });

    let usersAggregate = await UserModel.aggregate(pipeline).sort({
      createdOn: "desc",
    });

    return usersAggregate;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function getAllVendorsByStatus(status: String) {
  try {
    let pipeline = [
      {
        $match: {
          userType: "VENDOR",
          status: status,
        },
      },
      {
        $lookup: {
          from: "purchaseorders",
          localField: "_id",
          foreignField: "vendor",
          as: "purchaseorders",
        },
      },
      {
        $unwind: {
          path: "$purchaseorders",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          avgRate: {
            $avg: "$purchaseorders.rate",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "vendor",
        },
      },
      {
        $unwind: {
          path: "$vendor",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
    let users = await UserModel.find({ userType: "VENDOR", status })
      .populate("department")
      .sort({ createdOn: "desc" });

    let usersAggregate = await UserModel.aggregate(pipeline).sort({
      createdOn: "desc",
    });
    return usersAggregate;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function getAllLevel1Approvers() {
  try {
    let users = await UserModel.find(
      {
        "permissions.canApproveAsHod": true,
      },
      {
        firstName: 1,
        lastName: 1,
      }
    ).populate("department");
    return users;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function getVendorById2(id: string) {
  try {
    let users = await UserModel.findOne({
      userType: "VENDOR",
      _id: id,
    }).populate("department");
    return users;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}


export async function getInternalUserById(id: string) {
 
  try {
    let users = await UserModel.findOne({
      _id: id,
    }).populate("department");
    return users;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function getAllInternalUsers() {
  try {
    let users = await UserModel.find({ userType: { $ne: "VENDOR" } })
      .populate("department")
      .sort({ email: "asc" });
    return users;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function getAllInternalUsersByStatus(status: string) {
  try {
    let users = await UserModel.find({ userType: { $ne: "VENDOR" }, status })
      .populate("department")
      .sort({ email: "asc" });
    return users;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function createSupplierinB1(
  CardName: String,
  CardType: String,
  Series: any
) {
  let options = {
    // "CardCode": "SA0003",
    CardName,
    CardType,
    Series,
  };
  return sapLogin().then(async (res) => {

    let COOKIE = res.headers.get("set-cookie");
    localstorage.setItem("cookie", `${COOKIE}`);
    return fetch(`${process.env.IRMB_B1_SERVER}:${process.env.IRMB_B1_SERVICE_LAYER_PORT}/b1s/v1/BusinessPartners`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `${localstorage.getItem("cookie")}`,
      },
      body: JSON.stringify(options),
    })
      .then((res) => res.json())
      .then(async (res) => {
        console.log(res)
        if (res?.error && res?.error.code == 301) {
          console.log("Tried many times, we cant login");
          return false;
        } else {
          return true;
        }
      })
      .catch((err) => {
        console.log(err)
        return false;
      });
  });
}

export async function getB1SeriesFromNames(entityName: String) {
  let firstChar = entityName.substring(0, 1).toUpperCase();
  // let secondChar = lastName.substring(0,1).toUpperCase();
  let series = await getSeriesByDescription(`S${firstChar}`);
  return series;
}

export async function saveUser(user: User) {
  try {
    let createdUser = await UserModel.create(user);
    return createdUser._id;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function getUserByEmail(userEmail: String) {
  let user = await UserModel.findOne({
    $or: [{ email: userEmail }, { tempEmail: userEmail }],
  }).populate("department");
  return user;
}

export async function getVendorByCompanyName(name: String) {
  let user = await UserModel.findOne({ companyName: name });
  return user;
}

export async function approveUser(id: String) {

  try {
    let user = await UserModel.findById(id).populate("department");
    let name = user?.companyName;

    if (user?.userType === "VENDOR" && user?.status === 'pending-approval') {
      console.log(name)
      let series = await getB1SeriesFromNames(name!);

      let createdCode = await createSupplierinB1(name!, "cSupplier", series);

      if (createdCode) {
        user = await UserModel.findByIdAndUpdate(
          id,
          {
            $set: { status: "approved" },
          },
          { $new: true }
        ).populate("department");
        return user;
      }

      return {
        status: createdCode ? "approved" : "created",
        error: !createdCode,
        message: createdCode ? "" : "Could not connect to SAP B1.",
      };
    } else {
      
      user = await UserModel.findByIdAndUpdate(
        id,
        {
          $set: { status: "approved" },
        },
        { new: true }
      ).populate("department");

      return user;
    }
  } catch (err) {
    return {
      status: "created",
      error: true,
      message: "Could not connect to SAP B1.",
    };
  }
}

export async function declineUser(id: String) {
  try {
    let user = await UserModel.findByIdAndUpdate(
      id,
      { $set: { status: "rejected" } },
      { new: true }
    ).populate("department");
    return user;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function banUser(id: String) {
  try {
    let user = await UserModel.findByIdAndUpdate(
      id,
      { $set: { status: "banned" } },
      { new: true }
    ).populate("department");
    return user;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function activateUser(id: String) {
  try {
    let user = await UserModel.findByIdAndUpdate(
      id,
      { $set: { status: "approved" } },
      { new: true }
    ).populate("department");
    return user;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function updateUser(id: String, newUser: User) {
  try {
    let user = await UserModel.findByIdAndUpdate(id, newUser, {
      new: true,
    }).populate("department");
    return user;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function updateMyPassword(
  id: String,
  currentPassword: String,
  newPassword: String
) {
  try {
    let user = await UserModel.findById(id);
    if (validPassword(currentPassword, user?.password)) {
      user = await UserModel.findByIdAndUpdate(
        id,
        { $set: { password: newPassword } },
        { new: true }
      ).populate("department");
      return user;
    } else {
      return {
        error: true,
        errorMessage: `Please check the current password provided!`,
      };
    }
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function resetPassword(email: String) {
  let user = null;
  try {
    let newPassword = generatePassword(8);
    user = await UserModel.findOneAndUpdate(
      { email: email },
      { $set: { password: hashPassword(newPassword) } },
      { new: true }
    ).populate("department");

    if (user) {
      send(
        "",
        email,
        "Password reset",
        JSON.stringify({ email: user.email, password: newPassword }),
        "",
        "passwordReset"
      );
    }
    return user;
  } catch (err) {
    console.log(err);
    return user;
  }
}

export async function setTempFields(
  id: String,
  tempEmail: String | undefined,
  tempPassword: String
) {
  try {
    let user = await UserModel.findByIdAndUpdate(
      id,
      { $set: { tempEmail: tempEmail, tempPassword: tempPassword } },
      { new: true }
    );

    return user;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function saveBankDetails(
  id: String,
  bankName: String,
  bankAccountNumber: String
) {
  try {
    let user = await UserModel.findByIdAndUpdate(
      id,
      { $set: { bankName, bankAccountNumber } },
      { new: true }
    );
    return user;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}
