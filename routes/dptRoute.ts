import { Router } from 'express'
import { getAllDepartments } from '../controllers/departments';

export const dptRouter = Router();

dptRouter.get('/', async(req,res)=>{
    console.log('get dpts')
    res.status(200).send(await getAllDepartments())
})