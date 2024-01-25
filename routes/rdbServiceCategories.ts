import { Router } from 'express'
import { RdbServiceCategoryModel } from '../models/rdbServiceCategories';

export const rdbServiceCategoryRouter = Router();

rdbServiceCategoryRouter.get('/',async (req,res)=>{
    let categs = await RdbServiceCategoryModel.find().sort({description:'asc'});
    
    res.status(200).send(categs)
})