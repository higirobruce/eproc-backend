import { Router } from 'express'
import { Request } from '../classrepo/requests';
import { User } from '../classrepo/users';
import { approveRequest, declineRequest, getAllRequests, saveRequest } from '../controllers/requests';
import { approveUser, declineUser, getAllInternalUsers, getAllUsers, getAllVendors, getUserByEmail, saveUser } from '../controllers/users';
import { generateReqNumber } from '../services/requests';
import { generateUserNumber, hashPassword, validPassword } from '../services/users';

export const requetsRouter = Router();


requetsRouter.get('/', async (req, res) => {
    res.send(await getAllRequests())
})

requetsRouter.post('/', async (req, res) => {
    console.log(req.body);
    let {
        createdBy,
        items,
        dueDate,
        status,
        attachementUrls,
    } = req.body
    let number = await generateReqNumber();

    let requestToCreate = new Request(createdBy,items,dueDate,status,attachementUrls,number);

    let createdRequest = await saveRequest(requestToCreate);
    res.status(201).send(createdRequest)
})


requetsRouter.post('/approve/:id', async (req, res) => {
    let { id } = req.params;
    res.send(await approveRequest(id))
})

requetsRouter.post('/decline/:id', async (req, res) => {
    let { id } = req.params;
    res.send(await declineRequest(id))
})