import { Schema, model, Types } from "mongoose";
import { IContractDocument } from "../interfaces/iContracts";

export const Log = new Schema(
  {
    level: {},
    message: {},
    meta: {},
    hostname: {},
    timestamp: {},
  },
  { timestamps: true }
);

export const LogModel = model("Log", Log);
