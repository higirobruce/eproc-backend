import { Router } from "express";
import { User } from "../classrepo/users";
import {
  activateUser,
  approveUser,
  banUser,
  declineUser,
  getAllInternalUsers,
  getAllLevel1Approvers,
  getAllUsers,
  getAllVendors,
  getUserByEmail,
  saveUser,
  updateUser,
} from "../controllers/users";
import {
  generateUserNumber,
  hashPassword,
  validPassword,
} from "../services/users";
import { send } from "../utils/sendEmailNode";

export const userRouter = Router();

userRouter.get("/", async (req, res) => {
  res.send(await getAllUsers());
});

userRouter.get("/vendors", async (req, res) => {
  res.send(await getAllVendors());
});

userRouter.get("/level1Approvers", async (req, res) => {
  res.send(await getAllLevel1Approvers());
});

userRouter.get("/internal", async (req, res) => {
  res.send(await getAllInternalUsers());
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
  } = req.body;

  let number = await generateUserNumber();

  let userToCreate = new User(
    userType,
    email,
    telephone,
    experienceDurationInYears,
    experienceDurationInMonths,
    webSite,
    status,
    hashPassword(password),
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
    lastName
  );

  let createdUser = await saveUser(userToCreate);
  if(createdUser){
    send(
      "",
      email,
      "Account created",
      JSON.stringify({email,password}),
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
    res.send({
      allowed: validPassword(password, user!.password),
      user: user,
    });
  } else {
    res.send({
      allowed: false,
      user: {},
    });
  }
});

userRouter.post("/approve/:id", async (req, res) => {
  let { id } = req.params;
  console.log(id)
  res.send(await approveUser(id));
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
