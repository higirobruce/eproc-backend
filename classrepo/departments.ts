import { iDepartment } from './../interfaces/iDepartment';


export class Department implements iDepartment {
    number: number;
    description: string;

    constructor(number: number, description: string) {
        this.number = number;
        this.description = description;
    }

}