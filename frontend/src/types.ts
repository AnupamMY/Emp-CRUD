export interface EmployeeInput {
  name: string;
  email: string;
  role: string;
}

export interface Employee extends EmployeeInput {
  id: string;
  created_at: string;
}

export interface EmployeePage {
  employees: Employee[];
  total: number;
  page: number;
  totalPages: number;
}
