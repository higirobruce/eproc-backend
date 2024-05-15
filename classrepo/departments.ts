import { iDepartment } from "./../interfaces/iDepartment";

export class Department implements iDepartment {
  number: number;
  description: string;
  visible: boolean;

  constructor(number: number, description: string, visible: boolean) {
    this.number = number;
    this.description = description;
    this.visible = visible;
  }
}
