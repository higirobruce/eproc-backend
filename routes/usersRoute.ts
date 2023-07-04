import { Router } from "express";
import { User } from "../classrepo/users";
import { getVendorRate } from "../controllers/purchaseOrders";
import {
  activateUser,
  approveUser,
  banUser,
  declineUser,
  getAllInternalUsers,
  getAllInternalUsersByStatus,
  getAllLevel1Approvers,
  getAllUsers,
  getAllVendors,
  getAllVendorsByStatus,
  getInternalUserById,
  getUserByEmail,
  getVendorById,
  resetPassword,
  saveUser,
  updateMyPassword,
  updateUser,
  getUser
} from "../controllers/users";
import {
  generatePassword,
  generateUserNumber,
  hashPassword,
  validPassword,
} from "../services/users";
import { logger } from "../utils/logger";
import { send } from "../utils/sendEmailNode";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/users";

export let SALT =
  process.env.TOKEN_SALT || "968d8b95-72cd-4470-b13e-1017138d32cf";
export const userRouter = Router();

userRouter.get("/", async (req, res) => {
  res.send(await getAllUsers());
});

userRouter.get("/:id", async (req, res) => {
  let { id } = req.params;
  res.send(await getUser(id));
});

userRouter.get("/vendors", async (req, res) => {
  res.send(await getAllVendors());
});

userRouter.get("/vendors/rate/:id", async (req, res) => {
  let { id } = req.params;
  // console.log(id)
  res.send(await getVendorRate(id));
});

userRouter.get("/vendors/byId/:id", async (req, res) => {
  let { id } = req.params;
  // console.log(id)
  res.send(await getVendorById(id));
});

userRouter.get("/vendors/byStatus/:status", async (req, res) => {
  let { status } = req.params;
  if (status === "all") res.send(await getAllVendors());
  else res.send(await getAllVendorsByStatus(status));
});

userRouter.get("/level1Approvers", async (req, res) => {
  res.send(await getAllLevel1Approvers());
});

userRouter.get("/internal", async (req, res) => {
  res.send(await getAllInternalUsers());
});

userRouter.get("/internalUserById/:id", async (req, res) => {
  let { id } = req.params;
  res.send(await getInternalUserById(id));
});

userRouter.get("/internal/byStatus/:status", async (req, res) => {
  let { status } = req.params;
  if (status === "all") res.send(await getAllInternalUsers());
  else res.send(await getAllInternalUsersByStatus(status));
});

userRouter.post("/", async (req, res) => {
  let {
    userType,
    email,
    telephone,
    experienceDurationInYears,
    experienceDurationInMonths,
    webSite,
    status,
    password,
    createdOn,
    createdBy,
    rating,
    tin,
    companyName,
    notes,
    department,
    contactPersonNames,
    title,
    hqAddress,
    country,
    passportNid,
    services,
    permissions,
    rdbCertId,
    vatCertId,
    firstName,
    lastName,
    tempEmail,
    tempPassword,
  } = req.body;

  let password_new = userType == "VENDOR" ? password : generatePassword(8);
  let number = await generateUserNumber();
  let userToCreate = new User(
    userType,
    email,
    telephone,
    experienceDurationInYears,
    experienceDurationInMonths,
    webSite,
    status,
    hashPassword(password_new),
    createdOn,
    createdBy,
    rating,
    tin,
    companyName,
    number,
    notes,
    department,
    contactPersonNames,
    title,
    hqAddress,
    country,
    passportNid,
    services,
    permissions,
    rdbCertId,
    vatCertId,
    firstName,
    lastName,
    tempEmail,
    hashPassword(tempPassword || "tempPassword")
  );

  let createdUser = await saveUser(userToCreate);
  if (createdUser) {
    logger.log({
      level: "info",
      message: `${createdUser?._id} was successfully created`,
    });
    send(
      "",
      email,
      "Account created",
      JSON.stringify({ email, password: password_new }),
      "",
      "newUserAccount"
    );
  }
  res.status(201).send(createdUser);
});

userRouter.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    let user = await getUserByEmail(email);

    //genereate JWT
    let accessToken = jwt.sign({ email: email, user: user?._id }, SALT);

    if (user) {
      logger.log({
        level: "info",
        message: `${user?.email} successfully logged in`,
      });
      res.send({
        allowed:
          validPassword(password, user!.password) ||
          validPassword(password, user!.tempPassword),
        user: user,
        token: accessToken
      });
    } else {
      logger.log({
        level: "info",
        message: `${email} failed to log in`,
      });
      res.send({
        allowed: false,
        user: {},
      });
    }
  } catch (err) {
    console.log(err);
    res.status(401).send({ error: err });
  }
});

userRouter.post("/approve/:id", async (req, res) => {
  let { id } = req.params;
  let { approvedBy, avgRate } = req.body;
  let result = await approveUser(id);
  res.send(result).status(201);
});

userRouter.post("/decline/:id", async (req, res) => {
  let { id } = req.params;
  res.send(await declineUser(id));
});

userRouter.post("/ban/:id", async (req, res) => {
  let { id } = req.params;
  res.send(await banUser(id));
});

userRouter.post("/activate/:id", async (req, res) => {
  let { id } = req.params;
  res.send(await activateUser(id));
});

userRouter.put("/:id", async (req, res) => {
  let { id } = req.params;
  let { newUser } = req.body;

  res.send(await updateUser(id, newUser));
});

userRouter.put("/updatePassword/:id", async (req, res) => {
  let { id } = req.params;
  let { newPassword, currentPassword } = req.body;

  let updatedUser = await updateMyPassword(
    id,
    currentPassword,
    hashPassword(newPassword)
  );

  if (updatedUser) {
    logger.log({
      level: "warn",
      message: `Password for ${id} was successfully reset`,
    });
  }
  res.send(updatedUser);
});

userRouter.put("/reset/:email", async (req, res) => {
  let { email } = req.params;
  let updatedUser = await resetPassword(email);

  if (updatedUser) {
    logger.log({
      level: "warn",
      message: `Password for ${updatedUser?._id} was successfully reset`,
    });
  }
  res.send(updatedUser);
});

userRouter.put("/recoverPassword/:email", async (req, res) => {
  let { email } = req.params;

  try {
    res.send(await sendRecoverPasswordNotification(email));
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

userRouter.put("/resetPassword/:id", async (req, res) => {
  let { id } = req.params;
  let { token, newPassword } = req.body;
  if (!id) res.status(404).send({ errorMessage: "No userId specified" });
  else if (!token) res.status(404).send({ errorMessage: "No token provided" });
  else {
    try {
      let validToken = jwt.verify(token, SALT);

      if (validToken) {
        let _newPassword = hashPassword(newPassword);
        let updatedUser = await UserModel.findByIdAndUpdate(
          id,
          { $set: { password: _newPassword } },
          {
            new: true,
          }
        );

        res.status(201).send({ updatedUser });
      } else {
        res.status(401).send({ errorMessage: "Invalid token" });
      }
    } catch (err) {
      res.status(500).send({ error: err });
    }
  }
});

async function sendPostGoLiveNotification(email: string) {
  if (!email) throw { errorMessage: "No email specified" };
  // res.status(404).send();
  else {
    try {
      // let newPassword = hashPassword(generatePassword(8));
      let updatedUser = await getUserByEmail(email);
      let token = "";
      if (updatedUser) {
        token = jwt.sign(
          {
            email: updatedUser.email,
            firstName: updatedUser.firstName,
          },
          "968d8b95-72cd-4470-b13e-1017138d32cf",
          { expiresIn: "14d" }
        );
      }

      if (updatedUser) {
        await send(
          "from",
          email,
          "Password recovery Instructions",
          JSON.stringify({ user: updatedUser, token }),
          "html",
          "preGoLive"
        );

        return updatedUser;
        // res.status(201).send({ updatedUser });
      } else {
        throw { errorMessage: "The provided email does not exist!" };
        // res
        //   .status(404)
        //   .send();
      }
    } catch (err) {
      throw { error: err };
      // res.status(500).send();
    }
  }
}

async function sendRecoverPasswordNotification(email: string) {
  if (!email) throw { errorMessage: "No email specified" };
  // res.status(404).send();
  else {
    try {
      // let newPassword = hashPassword(generatePassword(8));
      let updatedUser = await getUserByEmail(email);
      let token = "";
      if (updatedUser) {
        token = jwt.sign(
          {
            email: updatedUser.email,
            firstName: updatedUser.firstName,
          },
          "968d8b95-72cd-4470-b13e-1017138d32cf",
          { expiresIn: "14d" }
        );
      }

      if (updatedUser) {
        await send(
          "from",
          email,
          "Password recovery Instructions",
          JSON.stringify({ user: updatedUser, token }),
          "html",
          "passwordRecover"
        );

        return updatedUser;
        // res.status(201).send({ updatedUser });
      } else {
        throw { errorMessage: "The provided email does not exist!" };
        // res
        //   .status(404)
        //   .send();
      }
    } catch (err) {
      throw { error: err };
      // res.status(500).send();
    }
  }
}

export async function sendNotificationToAllUsers() {
  let users = (await getAllInternalUsers()) as [];
  users?.forEach(async (user: any) => {
    await sendRecoverPasswordNotification(user?.email);
  });
}
