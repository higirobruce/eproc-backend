import { Router, NextFunction, Request, Response } from "express";
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
  getUser,
  getMyActivity,
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
import { updateBusinessPartnerById } from "../services/b1";
import * as _ from "lodash";
import mongoose from "mongoose";

export let SALT =
  process.env.TOKEN_SALT || "968d8b95-72cd-4470-b13e-1017138d32cf";
export const userRouter = Router();

let ensureUserAuthorized = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.token;
    if (!token) {
      res.status(401).send("Unauthorized");
    } else {
      let user = jwt.verify(token as string, SALT);
      req.session.user = user;

      next();
    }
  } catch (err) {
    res.status(401).send("Please send a valid access token in the header");
  }
};
userRouter.get("/", ensureUserAuthorized, async (req, res) => {
  res.send(await getAllUsers());
});

userRouter.get("/vendors", ensureUserAuthorized, async (req, res) => {
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

userRouter.get("/level1Approvers", ensureUserAuthorized, async (req, res) => {
  res.send(await getAllLevel1Approvers());
});

userRouter.get("/internal", ensureUserAuthorized, async (req, res) => {
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

userRouter.get("/activity/:id", async (req, res) => {
  let { id } = req.params;

  console.log(id)
  res.send(await getMyActivity(id as String));
});

userRouter.get("/:id", async (req, res) => {
  let { id } = req.params;
  res.send(await getUser(id));
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
    hashPassword(tempPassword || "tempPassword"),
    ""
  );

  let createdUserId = await saveUser(userToCreate);

  if (createdUserId) {
    logger.log({
      level: "info",
      message: `created user`,
      meta: {
        doneBy: req.session?.user?.user,
        referenceId: `${createdUserId?._id}`,
        module: userType === "VENDOR" ? "vendors" : "users",
      },
    });
    if (userType === "VENDOR") {
      send(
        "",
        email,
        "Account created",
        JSON.stringify({ email, password: password_new }),
        "",
        "newVendorAccount"
      );
    } else {
      send(
        "",
        email,
        "Account created",
        JSON.stringify({ email, password: password_new }),
        "",
        "newUserAccount"
      );
    }
  }
  res.status(201).send(createdUserId);
});

userRouter.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    let user = await getUserByEmail(email);

    //genereate JWT

    if (user) {
      logger.log({
        level: "info",
        message: `logged in`,
        meta: {
          doneBy: req.session?.user?.user,
          referenceId: user?._id?.toString(),
          module: user?.userType === "VENDOR" ? "vendors" : "users",
        },
      });

      let accessToken = jwt.sign(
        {
          email: email,
          user: user?._id,
          userObj: user,
          allowed:
            validPassword(password, user!.password) ||
            validPassword(password, user!.tempPassword),
        },
        SALT,
        {
          expiresIn: "8h", // expires in 24 hours
        }
      );
      res.send({
        // allowed:
        //   validPassword(password, user!.password) ||
        //   validPassword(password, user!.tempPassword),
        // user: user,
        token: accessToken,
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

userRouter.post("/approve/:id", ensureUserAuthorized, async (req, res) => {
  let { id } = req.params;
  let { approvedBy, avgRate } = req.body;
  let result: any = await approveUser(id);

  logger.log({
    level: "info",
    message: `approved of user account`,
    meta: {
      doneBy: req.session?.user?.user,
      referenceId: `${id}`,
      module: result?.userType === "VENDOR" ? "vendors" : "users",
    },
  });

  send(
    "",
    result?.email,
    "Account approved",
    JSON.stringify({ email: result?.email }),
    "",
    "accountApproved"
  );
  res.send(result).status(201);
});

userRouter.post("/decline/:id", ensureUserAuthorized, async (req, res) => {
  let { id } = req.params;

  let result: any = await declineUser(id);

  logger.log({
    level: "info",
    message: `declined user account`,
    meta: {
      doneBy: req.session?.user?.user,
      referenceId: `${id}`,
      module: result?.userType === "VENDOR" ? "vendors" : "users",
    },
  });
  send(
    "",
    result?.email,
    "Account declined",
    JSON.stringify({ email: result?.email }),
    "",
    "accountDeclined"
  );
  res.send(result);
});

userRouter.post("/ban/:id", ensureUserAuthorized, async (req, res) => {
  let { id } = req.params;
  let result: any = await banUser(id);
  logger.log({
    level: "info",
    message: `banned user account`,
    meta: {
      doneBy: req.session?.user?.user,
      referenceId: `${id}`,
      module: result?.userType === "VENDOR" ? "vendors" : "users",
    },
  });
  res.send(result);
});

userRouter.post("/activate/:id", ensureUserAuthorized, async (req, res) => {
  let { id } = req.params;

  let result: any = await activateUser(id);
  logger.log({
    level: "info",
    message: `activated user account`,
    meta: {
      doneBy: req.session?.user?.user,
      referenceId: `${id}`,
      module: result?.userType === "VENDOR" ? "vendors" : "users",
    },
  });
  res.send(result);
});

userRouter.put("/:id", ensureUserAuthorized, async (req, res) => {
  let { id } = req.params;
  let { newUser } = req.body;

  let nUser = _.omit(newUser, "sapCode");

  let updates: any = await updateUser(id, nUser);

  logger.log({
    level: "info",
    message: `updated user account`,
    meta: {
      doneBy: req.session?.user?.user,
      referenceId: `${id}`,
      module: updates?.userType === "VENDOR" ? "vendors" : "users",
    },
  });

  res.send(updates);
});

userRouter.put("/update/:id", ensureUserAuthorized, async (req, res) => {
  let nu = await updateBusinessPartnerById(req.params.id, req.body);

  logger.log({
    level: "info",
    message: `updated of user account`,
    meta: {
      doneBy: req.session?.user?.user,
      referenceId: `${req.params.id}`,
      module: "users",
    },
  });

  res.send(nu);
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
      level: "info",
      message: `rest password for `,
      meta: {
        doneBy: req.session?.user?.user,
        referenceId: `${id}`,
        module: "users",
      },
    });
  }
  res.send(updatedUser);
});

userRouter.put("/reset/:email", async (req, res) => {
  let { email } = req.params;

  let updatedUser: any = await resetPassword(email);

  if (updatedUser) {
    logger.log({
      level: "info",
      message: `rest password for `,
      meta: {
        doneBy: req.session?.user?.user,
        referenceId: `${updatedUser?._id}`,
        module: "users",
      },
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
