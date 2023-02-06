import { Router } from 'express'
import { getAllDepartments } from '../controllers/departments';

export const dptRouter = Router();

dptRouter.get('/', async(req,res)=>{
    res.status(200).send(await getAllDepartments())
})