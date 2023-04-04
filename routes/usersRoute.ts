import { Router } from "express";
import { User } from "../classrepo/users";
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
  getUserByEmail,
  resetPassword,
  saveUser,
  updateMyPassword,
  updateUser,
} from "../controllers/users";
import {
  generatePassword,
  generateUserNumber,
  hashPassword,
  validPassword,
} from "../services/users";
import { logger } from "../utils/logger";
import { send } from "../utils/sendEmailNode";

export const userRouter = Router();

userRouter.get("/", async (req, res) => {
  res.send(await getAllUsers());
});

userRouter.get("/vendors", async (req, res) => {
  res.send(await getAllVendors());
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

userRouter.get("/internal/byStatus/:status", async (req, res) => {
  let {status} = req.params
  if(status==='all') res.send(await getAllInternalUsers());
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
    hashPassword(tempPassword)
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
  let { email, password } = req.body;

  let user = await getUserByEmail(email);

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
});

userRouter.post("/approve/:id", async (req, res) => {
  let { id } = req.params;
  let { approvedBy } = req.body;
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
