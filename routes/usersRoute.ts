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

userRouter.get("/:id", async (req, res) => {
  let { id } = req.params;
  res.send(await getUser(id));
});

userRouter.post("/", ensureUserAuthorized, async (req, res) => {
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

  let createdUser = await saveUser(userToCreate);

  if (createdUser?._id) {
    logger.log({
      level: "info",
      message: `${createdUser?._id} was successfully created`,
      meta: {
        doneBy: req.session?.user,
        payload: req.body,
      },
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

    if (user) {
      logger.log({
        level: "info",
        message: `${user?.email} successfully logged in`,
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
  let result = await approveUser(id);
  logger.log({
    level: "info",
    message: `Approval of User ${id} successfully done`,
    meta: {
      doneBy: req.session?.user,
      payload: req.body,
    },
  });
  res.send(result).status(201);
});

userRouter.post("/decline/:id",ensureUserAuthorized, async (req, res) => {
  let { id } = req.params;
  logger.log({
    level: "info",
    message: `Declining of User ${id} successfully done`,
    meta: {
      doneBy: req.session?.user,
      payload: req.body,
    },
  });
  res.send(await declineUser(id));
});

userRouter.post("/ban/:id",ensureUserAuthorized, async (req, res) => {
  let { id } = req.params;
  logger.log({
    level: "info",
    message: `Banning of User ${id} successfully done`,
    meta: {
      doneBy: req.session?.user,
      payload: req.body,
    },
  });
  res.send(await banUser(id));
});

userRouter.post("/activate/:id",ensureUserAuthorized, async (req, res) => {
  let { id } = req.params;
  logger.log({
    level: "info",
    message: `Activation of User ${id} successfully done`,
    meta: {
      doneBy: req.session?.user,
      payload: req.body,
    },
  });
  res.send(await activateUser(id));
});

userRouter.put("/:id",ensureUserAuthorized, async (req, res) => {
  let { id } = req.params;
  let { newUser } = req.body;

  let nUser = _.omit(newUser, "sapCode");

  let updates = await updateUser(id, nUser);

  logger.log({
    level: "info",
    message: `Update of User ${id} successfully done`,
    meta: {
      doneBy: req.session?.user,
      payload: req.body,
    },
  });

  res.send(updates);
});

userRouter.put("/update/:id", ensureUserAuthorized, async (req, res) => {
  let nu = await updateBusinessPartnerById(req.params.id, req.body);
  logger.log({
    level: "info",
    message: `Update of User ${req.params.id} successfully done`,
    meta: {
      doneBy: req.session?.user,
      payload: req.body,
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
      level: "warn",
      message: `Password for ${id} was successfully reset`,
      
    });
  }
  res.send(updatedUser);
});

userRouter.put("/reset/:email", async (req, res) => {
  let { email } = req.params;

  let updatedUser: any = await resetPassword(email);

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
