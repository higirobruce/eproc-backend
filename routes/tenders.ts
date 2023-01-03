import { Router } from 'express'
import { PoLineItem } from '../classrepo/poLineItems';
import { Request } from '../classrepo/requests';
import { Tender } from '../classrepo/tenders';
import { User } from '../classrepo/users';
import { approveRequest, declineRequest, getAllRequests, saveRequest, updateRequestStatus } from '../controllers/requests';
import { getAllTenders, saveTender, updateTenderStatus } from '../controllers/tenders';
import { generateReqNumber } from '../services/requests';
import { generateTenderNumber } from '../services/tenders';

export const tenderRouter = Router();


tenderRouter.get('/', async (req, res) => {
    res.send(await getAllTenders())
})

tenderRouter.post('/', async (req, res) => {
    let {
        createdBy,
        items,
        dueDate,
        status,
        attachementUrls,
        submissionDeadLine,
        torsUrl,
        purchaseRequest
    } = req.body
    let number = await generateTenderNumber();
    let itemObjects = items.map((i: PoLineItem) => {
        if (!i.currency) i.currency = 'RWF';
        return i;
    })


    let tenderToCreate = new Tender(createdBy, itemObjects, dueDate, status, attachementUrls, number, submissionDeadLine, torsUrl, purchaseRequest);

    let createdTender = await saveTender(tenderToCreate);
    res.status(201).send(createdTender)
})


tenderRouter.put('/status/:id', async (req, res) => {
    let { id } = req.params;
    let { status } = req.body;
    res.send(await updateTenderStatus(id, status))
})