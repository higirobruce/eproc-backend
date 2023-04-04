import { Router } from 'express'
import { ServiceCategoryModel } from '../models/serviceCategories';

export const serviceCategoryRouter = Router();

serviceCategoryRouter.get('/',async (req,res)=>{
    let categs = await ServiceCategoryModel.find().sort({description:'asc'});
    
    res.status(200).send(categs)
})