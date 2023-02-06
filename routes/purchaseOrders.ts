import { Router } from 'express'
import { PurchaseOrder } from '../classrepo/purchaseOrders';
import { getAllPOs, getPOByTenderId, getPOByVendorId, savePO, updatePOStatus, updateProgress } from '../controllers/purchaseOrders';
import { generatePONumber } from '../services/purchaseOrders';

export const poRouter = Router();


poRouter.get('/', async (req, res) => {
    res.send(await getAllPOs())
})

poRouter.get('/byTenderId/:tenderId', async (req, res) => {
    let { tenderId } = req.params
    res.send(await getPOByTenderId(tenderId))
})

poRouter.get('/byVendorId/:vendorId', async (req, res) => {
    let { vendorId } = req.params
    res.send(await getPOByVendorId(vendorId))
})



poRouter.post('/', async (req, res) => {
    let {
        vendor,
        tender,
        createdBy,
        paymentTerms,
        status,
        deliveryProgress
    } = req.body

    console.log(req.body)
    let number = await generatePONumber();


    let tenderToCreate = new PurchaseOrder(number,
        vendor,
        tender,
        createdBy,
        paymentTerms,
        status,
        deliveryProgress);

    let createdTender = await savePO(tenderToCreate);
    res.status(201).send(createdTender)
})


poRouter.put('/status/:id', async (req, res) => {
    let { id } = req.params;
    let { status } = req.body;
    res.send(await updatePOStatus(id, status))
})

poRouter.put('/progress/:id', async (req, res) => {
    let { id } = req.params;
    let { deliveryProgress } = req.body;
    res.send(await updateProgress(id, deliveryProgress))
})