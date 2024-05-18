import { PipelineStage } from "mongoose";
import { ServiceCategoryModel } from "../models/serviceCategories";
import { RdbServiceCategoryModel } from "../models/rdbServiceCategories";

export async function getAllServiceCategories(visible: any) {
  //   let pipeline: PipelineStage[] = [
  //     {
  //       '$lookup': {
  //         'from': 'rdbservicecategories',
  //         'localField': 'rdbServiceId',
  //         'foreignField': '_id',
  //         'as': 'rdbServiceId'
  //       }
  //     }, {
  //       '$unwind': {
  //         'path': '$rdbServiceId',
  //         'preserveNullAndEmptyArrays': false
  //       }
  //     }, {
  //       '$addFields': {
  //         'description': '$rdbServiceId.description',
  //         '_id': '$rdbServiceId._id',
  //         'visible': '$rdbServiceId.visible'
  //       }
  //     }, {
  //       '$project': {
  //         'rdbServiceId': 0
  //       }
  //     }, {
  //       '$group': {
  //         '_id': {
  //           'description': '$description',
  //           'visible': '$visible'
  //         },
  //         'uniqueRecords': {
  //           '$addToSet': '$_id'
  //         }
  //       }
  //     }, {
  //       '$project': {
  //         '_id': 0,
  //         'description': '$_id.description',
  //         'visible': '$_id.visible',
  //         'uniqueRecords': 1
  //       }
  //     }, {
  //       '$unwind': {
  //         'path': '$uniqueRecords',
  //         'preserveNullAndEmptyArrays': false
  //       }
  //     }, {
  //       '$project': {
  //         '_id': '$uniqueRecords',
  //         'description': 1,
  //         'visible': 1
  //       }
  //     }, {
  //       '$sort': {
  //         'description': 1
  //       }
  //     }
  //   ];

  // let categs = await ServiceCategoryModel.find().sort({description:'asc'});
  //   let categs = await ServiceCategoryModel.aggregate(pipeline).sort({
  //     description: 1,
  //   });

  let query = {};

  if (visible == 1 || visible == "1") {
    query = {
      visible: true,
    };
  }
  if (visible == 0 || visible == "0") {
    query = {
      visible: false,
    };
  }

  let categs = await RdbServiceCategoryModel.find(query).sort({
    description: "asc",
  });
  return categs;
}

export async function updateServiceCategory(id: String, update: any) {
  //get rdbServiceCategory
  try {
    // let serviceObj = await ServiceCategoryModel.findById(id);
    // let rdbServiceId = serviceObj?.rdbServiceId;

    // console.log(serviceObj)

    //update the rdbServiceCategory
    let updates = await RdbServiceCategoryModel.findByIdAndUpdate(id, update);

    return updates;
  } catch (err) {}
}

export async function saveCategoryService(description: String) {
  let newCategory = new RdbServiceCategoryModel({
    description: description,
    visible: true,
  });

  let saved = await newCategory.save();

  return newCategory;
}
