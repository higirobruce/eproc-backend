import { Schema, model } from "mongoose";
export const RdbServiceCategory = new Schema(
  {
    description: {
      type: String,
      unique: true,
      dropDups: true,
    },
    visible: {
      type: Boolean,
      defaul: true,
    },
  },
  { timestamps: true }
);

export const RdbServiceCategoryModel = model(
  "RdbServiceCategory",
  RdbServiceCategory
);
