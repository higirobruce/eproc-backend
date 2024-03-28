import { Router } from "express";
import { ServiceCategoryModel } from "../models/serviceCategories";
import { RdbServiceCategoryModel } from "../models/rdbServiceCategories";
import { PipelineStage } from "mongoose";

export const serviceCategoryRouter = Router();

serviceCategoryRouter.get("/", async (req, res) => {
  let pipeline: PipelineStage[] = [
    {
      $lookup: {
        from: "rdbservicecategories",
        localField: "rdbServiceId",
        foreignField: "_id",
        as: "rdbServiceId",
      },
    },
    {
      $unwind: {
        path: "$rdbServiceId",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $addFields: {
        description: "$rdbServiceId.description",
        _id: "$rdbServiceId._id",
      },
    },
    {
      $project: {
        rdbServiceId: 0,
      },
    },
    {
      $group: {
        _id: "$description",
        uniqueRecords: {
          $addToSet: "$_id",
        },
      },
    },
    {
      $project: {
        _id: 0,
        description: "$_id",
        uniqueRecords: 1,
      },
    },
    {
      $unwind: {
        path: "$uniqueRecords",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $project: {
        _id: "$uniqueRecords",
        description: 1,
      },
    },
    {
      $sort: {
        description: 1,
      },
    },
  ];

  // let categs = await ServiceCategoryModel.find().sort({description:'asc'});
  let categs = await ServiceCategoryModel.aggregate(pipeline);
  res.status(200).send(categs);
});
