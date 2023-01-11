import { Router } from 'express'
import { getAllBidSubmissions, getAllBidSubmissionsByTender, iSubmittedOnTender, rejectOtherSubmissions, rejectSubmission, saveBidSubmission, selectSubmission, updateSubmissionStatus } from '../controllers/bidSubmissions';
import { BidSubmission } from '../classrepo/bidSubmissions';
import { generateBidSubmissionNumber } from '../services/bidSubmissions';

export const submissionsRouter = Router();


submissionsRouter.get('/', async (req, res) => {
    res.send(await getAllBidSubmissions())
})

submissionsRouter.get('/byTender/:tenderId', async (req, res) => {
    let { tenderId } = req.params
    console.log(tenderId)
    res.send(await getAllBidSubmissionsByTender(tenderId))
})

submissionsRouter.get('/submitted/:tenderId', async (req, res) => {
    let { tenderId } = req.params
    let { vendorId } = req.query
    res.send(await iSubmittedOnTender(tenderId, vendorId))
})

submissionsRouter.post('/', async (req, res) => {
    let {
        proposalUrls,
        deliveryDate,
        price,
        warranty,
        discount,
        status,
        comment,
        createdBy,
        tender
    } = req.body
    let number = await generateBidSubmissionNumber();

    let submission = new BidSubmission(proposalUrls,
        deliveryDate,
        price,
        warranty,
        discount,
        status,
        comment, number, createdBy, tender);

    let createdSubmission = await saveBidSubmission(submission)
    console.log(createdSubmission);
    res.status(201).send(createdSubmission)
})


submissionsRouter.post('/select/:id', async (req, res) => {
    let { id } = req.params;
    let {tenderId} = req.query
    selectSubmission(id).then(async (r) => {
        await rejectOtherSubmissions(tenderId);
        res.send(r)
    })

})

submissionsRouter.post('/reject/:id', async (req, res) => {
    let { id } = req.params;
    res.send(await rejectSubmission(id))
})

submissionsRouter.put('/status/:id', async (req, res) => {
    let { id } = req.params;
    let { status } = req.body;
    res.send(await updateSubmissionStatus(id, status))
})