

import mongoose, { Schema, model } from 'mongoose';
export const ServiceCategory = new Schema({

    description: {
        type: String, unique: true,
        dropDups: true,
    },
    rdbServiceId:{
        type: mongoose.Types.ObjectId,
        ref: "RdbServiceCategory"
    },
    visible: {
        type: Boolean,
        default: true
    }
},{timestamps: true})

export const ServiceCategoryModel = model('ServiceCategory', ServiceCategory);