

import { Schema, model } from 'mongoose';
export const ServiceCategory = new Schema({

    description: {
        type: String, unique: true,
        dropDups: true,
    }
},{timestamps: true})

export const ServiceCategoryModel = model('ServiceCategory', ServiceCategory);