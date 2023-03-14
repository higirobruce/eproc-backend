import { User } from "../classrepo/users";
import { UserModel } from "../models/users";
import { sapLogin, SESSION_ID } from "../utils/sapB1Connection";
import { getSeriesByDescription } from "./series";
import { LocalStorage } from "node-localstorage";

let localstorage = new LocalStorage("./scratch");

export async function getAllUsers() {
  try {
    let users = await UserModel.find().populate("department");
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
    let users = await UserModel.find({ userType: "VENDOR" }).populate(
      "department"
    ).sort({createdOn:'desc'})
    return users;
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

export async function getVendorById(id: string) {
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

export async function getAllInternalUsers() {
  try {
    let users = await UserModel.find({ userType: { $ne: "VENDOR" } }).populate(
      "department"
    );
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
    return fetch("https://192.168.20.181:50000/b1s/v1/BusinessPartners", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `${localstorage.getItem("cookie")}`,
      },
      body: JSON.stringify(options),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res?.error && res?.error.code == 301) {
          console.log("Tried many times, we cant login");
          return false;
        } else {
          return true;
        }
      })
      .catch((err) => {
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
    console.log(err);
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function getUserByEmail(userEmail: String) {
  let user = await UserModel.findOne({ email: userEmail }).populate(
    "department"
  );
  return user;
}

export async function approveUser(id: String) {
  try {
    let user = await UserModel.findById(id).populate("department");
    let name = user?.companyName;
    if (user?.userType === "VENDOR") {
      let series = await getB1SeriesFromNames(name!);
      let createdCode = await createSupplierinB1(name!, "cSupplier", series);

      if (createdCode) {
        user = await UserModel.findByIdAndUpdate(id, {
          $set: { status: "approved" },
        }).populate("department");
        return user;
      }

      return {
        status: createdCode ? "approved" : "created",
        error: !createdCode,
        message: createdCode ? "" : "Could not connect to SAP B1.",
      };
    } else {
      user = await UserModel.findByIdAndUpdate(id, {
        $set: { status: "approved" },
      }).populate("department");

      return user;
    }
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function declineUser(id: String) {
  try {
    let user = await UserModel.findByIdAndUpdate(
      id,
      { $set: { status: "declined" } },
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

export async function banUser(id: String) {
  try {
    let user = await UserModel.findByIdAndUpdate(
      id,
      { $set: { status: "banned" } },
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

export async function activateUser(id: String) {
  try {
    let user = await UserModel.findByIdAndUpdate(
      id,
      { $set: { status: "approved" } },
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

export async function updateUser(id: String, newUser: User) {
  try {
    let user = await UserModel.findByIdAndUpdate(id, newUser, { new: true });
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
