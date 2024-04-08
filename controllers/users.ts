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
import {
  getBusinessPartnerByName,
  updateBusinessPartnerById,
} from "../services/b1";
import { timingSafeEqual } from "crypto";
import fetch from "cross-fetch";
import * as _ from "lodash";

let localstorage = new LocalStorage("./dist");

export async function getAllUsers() {
  try {
    let users = await UserModel.find()
      .populate("department")
      .sort({"number": -1})
      .select({ password: 0 });

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
    let users = await UserModel.findById(id);

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
      .sort({"vendor.number": -1});

    let usersAggregate = await UserModel.aggregate(pipeline).sort({
      "vendor.number": -1,
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
      .sort({"number": -1});

    let usersAggregate = await UserModel.aggregate(pipeline).sort({"vendor.number": -1});

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
      .sort({"vendor.number": -1});

    let usersAggregate = await UserModel.aggregate(pipeline).sort({
      "vendor.number": -1,
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
    ).populate("department")
    .sort({"number": -1});
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
    }).populate("department")
    .sort({"vendor.number": -1});
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
    }).populate("department")
    .sort({"number": -1});

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
      .sort({"number": -1});
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
      .sort({"number": -1});
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
  Series: any,
  tin: any,
  phone: any,
  email: any,
  currency: any
) {
  let options = {
    // "CardCode": "SA0003",
    CardName,
    CardType,
    Series,
    FederalTaxID: tin,
    Phone1: phone,
    Cellular: phone,
    EmailAddress: email,
    Currency: currency,
    DefaultCurrency: "RWF",
    DebitorAccount: phone.indexOf("+250") !== -1 ? "2101030001" : "2101030002",
    // Valid: 'N',
    // Frozen: 'Y'
  };
  return sapLogin().then(async (res) => {
    let COOKIE = res.headers.get("set-cookie");
    localstorage.setItem("cookie", `${COOKIE}`);
    return fetch(
      `${process.env.IRMB_B1_SERVER}:${process.env.IRMB_B1_SERVICE_LAYER_PORT}/b1s/v1/BusinessPartners`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `${localstorage.getItem("cookie")}`,
        },
        body: JSON.stringify(options),
      }
    )
      .then((res) => res.json())
      .then(async (res) => {
        if (res?.error) {
          console.log("Tried many times, we cant login");
          return false;
        } else {
          return res;
        }
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  });
}

export async function updateSupplierinB1(CardCode: String, options: any) {
  return sapLogin().then(async (res) => {
    let COOKIE = res.headers.get("set-cookie");
    localstorage.setItem("cookie", `${COOKIE}`);
    return fetch(
      `${process.env.IRMB_B1_SERVER}:${process.env.IRMB_B1_SERVICE_LAYER_PORT}/b1s/v1/BusinessPartners('${CardCode}')`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `${localstorage.getItem("cookie")}`,
        },
        body: JSON.stringify(options),
      }
    )
      .then((res) => {
        if (res.status === 204) {
          return {
            error: false,
            message: "Successfull",
          };
        } else {
          return res.json();
        }
      })
      .then(async (res) => {
        if (res?.error) {
          console.log(res?.error);
          return false;
        } else {
          return res;
        }
      })
      .catch((err) => {
        console.log(err);
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
    let tin = user.tin;

    let userWithSameTin = await UserModel.findOne({ tin });

    if (userWithSameTin && typeof tin == "number") {
      return {
        error: true,
        errorMessage: `Error : A vendor with the same TIN already exists!`,
      };
    }
    let createdUser = await UserModel.create(user);

    
    return createdUser._id;
  } catch (err: any) {
    let message = "";
    let erroParts = err.toString().split(":");
    if (erroParts[1].includes("E11000") && erroParts[3].includes("email"))
      message = "The provided Email address is already in use";
    else message = "Unknown error occured!";
    return {
      error: true,
      errorMessage: `Error :${message}`,
    };
  }
}

export async function getUserByEmail(userEmail: String) {
  let user = await UserModel.findOne({
    $or: [{ email: userEmail }, { tempEmail: userEmail }],
  }).populate("department")
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
    let tin = user?.tin;
    let phone = user?.telephone;
    let email = user?.email;
    let currency = "##";

    if (!user?.sapCode && user) {
      let u = await getBusinessPartnerByName(name);
      let code = u?.value && u?.value[0]?.CardCode;
      user.sapCode = code;
      await user.save();
    }

    if (user?.userType === "VENDOR" && user?.status === "pending-approval") {

      let series = await getB1SeriesFromNames(name!);

      let createdCode = await createSupplierinB1(
        name!,
        "cSupplier",
        series,
        tin,
        phone,
        email,
        currency
      );

      if (createdCode) {
        user = await UserModel.findByIdAndUpdate(
          id,
          {
            $set: { status: "approved", sapCode: createdCode?.CardCode },
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
      if (user) {
        await updateSupplierinB1(user?.sapCode, { Valid: "Y", Frozen: "N" });
      }
      return user;
    }
  } catch (err) {
    console.log(err);
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
    let name = user?.companyName;
    if (!user?.sapCode && user) {
      let u = await getBusinessPartnerByName(name);
      let code = u?.value && u?.value[0]?.CardCode;
      user.sapCode = code;
      await user.save();
    }
    if (user) {
      await updateSupplierinB1(user?.sapCode, { Valid: "N", Frozen: "Y" });
    }
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

    let name = user?.companyName;
    if (!user?.sapCode && user) {
      let u = await getBusinessPartnerByName(name);
      let code = u?.value && u?.value[0]?.CardCode;
      user.sapCode = code;
      await user.save();
    }
    if (user) {
      await updateSupplierinB1(user?.sapCode, { Valid: "N", Frozen: "Y" });
    }
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
    let name = user?.companyName;
    if (!user?.sapCode && user) {
      let u = await getBusinessPartnerByName(name);
      let code = u?.value && u?.value[0]?.CardCode;
      user.sapCode = code;
      await user.save();
    }

    if (user) {
      await updateSupplierinB1(user?.sapCode, { Valid: "Y", Frozen: "N" });
    }
    return user;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function updateUser(id: String, newUser: User | any) {
  try {
    let userWithSameTin = await UserModel.findOne({
      tin: newUser?.tin,
      _id: { $ne: id }
    });
    if (userWithSameTin && newUser?.userType == "VENDOR") {
      return {
        error: true,
        errorMessage: `Error : A vendor with the same TIN already exists!`,
      };
    }
    
        
    let user = await UserModel.findByIdAndUpdate(id, newUser, {
      new: true,
    }).populate("department");
    if (user?.userType === "VENDOR") {
      await updateBusinessPartnerById(user?.sapCode, {
        CardName: user?.companyName,
        FederalTaxID: user?.tin,
        Phone1: user?.telephone,
        Phone2: user?.telephone,
        EmailAddress: user?.email,
      });
    }

    return user;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error : Could not connect to SAP!`,
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
  let user;
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
