import { Router } from 'express'
import { User } from '../classrepo/users';
import { approveUser, declineUser, getAllInternalUsers, getAllUsers, getAllVendors, getUserByEmail, saveUser } from '../controllers/users';
import { generateUserNumber, hashPassword, validPassword } from '../services/users';

export const userRouter = Router();


userRouter.get('/', async (req, res) => {
    res.send(await getAllUsers())
})

userRouter.get('/vendors', async (req, res) => {
    res.send(await getAllVendors())
})

userRouter.get('/internal', async (req, res) => {
    res.send(await getAllInternalUsers())
})


userRouter.post('/', async (req, res) => {
    console.log(req.body);
    let {
        userType,
        firstName,
        lastName,
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
        companyEmail,
        nid,
        passport,
        notes,
        department
    } = req.body
    let number = await generateUserNumber();

    let userToCreate = new User(userType,
        firstName,
        lastName,
        email,
        telephone,
        experienceDurationInYears,
        experienceDurationInMonths,
        webSite,
        status,
        hashPassword(password),
        createdOn,
        createdBy,
        rating, tin, companyName,
        companyEmail,
        nid,
        passport, number, notes, department)

    let createdUser = await saveUser(userToCreate);
    res.status(201).send(createdUser)
})

userRouter.post('/login', async (req, res) => {
    let { email, password } = req.body;
    
    let user = await getUserByEmail(email);

    if(user){
        res.send({
            allowed: validPassword(password, user!.password),
            user: user
        })
    } else {
        res.send({
            allowed: false,
            user: {}
        })
    }

    
})


userRouter.post('/approve/:id', async (req, res) => {
    let { id } = req.params;
    res.send(await approveUser(id))
})

userRouter.post('/decline/:id', async (req, res) => {
    let { id } = req.params;
    res.send(await declineUser(id))
})