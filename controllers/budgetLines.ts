import { BudgetLine } from "../classrepo/budgetLines";
import { BudgetLineModel } from "../models/budgetLines";
import { DepartmentModel } from "../models/departments";

export async function getAllBudgetLines() {
  let pipeline = [
    {
      $lookup: {
        from: "budgetlines",
        localField: "_id",
        foreignField: "department",
        as: "budgetlines",
      },
    },
  ];
  try {
    // let dpts = await BudgetLineModel.find();
    let _dpts = await DepartmentModel.aggregate(pipeline);

    return _dpts;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function getAllBudgetLinesOnly() {
  let pipeline = [
    {
      $lookup: {
        from: "departments",
        localField: "department",
        foreignField: "_id",
        as: "department",
      },
    },
    {
      $unwind: {
        path: "$department",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $addFields: {
        department: "$department.description",
      },
    },
  ];

  try {
    // let dpts = await BudgetLineModel.find().sort({ description: 1 });
    let dpts = await BudgetLineModel.aggregate(pipeline);

    return dpts;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function saveBudgetLine(budgetLine: BudgetLine) {
  try {
    let createdBudgetL = await BudgetLineModel.create(budgetLine);
    return createdBudgetL._id;
  } catch (err) {
    return {
      error: true,
      errorMessage: `Error :${err}`,
    };
  }
}

export async function updateBudgetLine(id: String, update: any) {
  try {
    let updatedBg = await BudgetLineModel.updateOne(
      { _id: id },
      { $set: { description: update?.description, visible: update?.visible } },
      { new: true }
    );

    console.log(updatedBg);
    return updatedBg;
  } catch (err) {
    console.log(err);
  }
}
