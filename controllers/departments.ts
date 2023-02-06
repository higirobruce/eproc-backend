import { Department } from './../classrepo/departments';
import { DepartmentModel } from "../models/departments";

export async function getAllDepartments() {
    try {
        let dpts = await DepartmentModel.find();
        return dpts;
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}

export async function saveDepartment(dpt: Department) {
    try {
        let createdDpt = await DepartmentModel.create(dpt)
        return createdDpt._id
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}
