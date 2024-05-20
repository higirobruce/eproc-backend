import { Types } from "mongoose";
import { Department } from "./../classrepo/departments";
import { DepartmentModel } from "../models/departments";
import { BudgetLineModel } from "../models/budgetLines";
import { pipeline } from "stream";

export async function getAllDepartments() {
  try {
    let dpts = await DepartmentModel.find().sort({ description: 1 });
    return dpts;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function saveDepartment(dpt: Department) {
  try {
    let createdDpt = await DepartmentModel.create(dpt);
    return createdDpt._id;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function updateDepartment(id: any, update: any) {
  let pipeline_Number_visible_BLines = [
    {
      $match: {
        visible: true,
        department: new Types.ObjectId(id),
      },
    },
    {
      $count: "visible",
    },
  ];
  try {
    let tyingToHide = !update?.visible;

    if (tyingToHide) {
      let nVisibleBidgetLines = await BudgetLineModel.aggregate(
        pipeline_Number_visible_BLines
      );

      if (nVisibleBidgetLines[0]?.visible > 0) {
        console.log("Tyiiin");
        return {
          error: true,
          message: "First hide all the budget lines under this department!",
        };
      }
    }
    let updatedDpt = await DepartmentModel.findByIdAndUpdate(id, update);
    return updatedDpt;
  } catch (err) {}
}
