import type { Request, Response } from 'express';
import { validateEmployee } from '../validation/employee';
import Employee from '../models/employeeModel';

export async function getEmployees(req: Request, res: Response) {
  const search =
    typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const limit = Math.min(
    100,
    Math.max(1, parseInt(String(req.query.limit), 10) || 5),
  );
  const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
  res.json(await Employee.list(search, limit, page));
}

export async function createEmployee(req: Request, res: Response) {
  const { input, error } = validateEmployee(req.body);
  if (!input) return res.status(400).json({ message: error });
  res.status(201).json(await Employee.create(input));
}

export async function updateEmployee(req: Request, res: Response) {
  const { input, error } = validateEmployee(req.body);
  if (!input) return res.status(400).json({ message: error });
  const employee = await Employee.update(String(req.params.id), input);
  if (!employee)
    return res.status(404).json({ message: 'Employee not found.' });
  res.json(employee);
}

export async function deleteEmployee(req: Request, res: Response) {
  const deleted = await Employee.delete(String(req.params.id));
  if (!deleted) return res.status(404).json({ message: 'Employee not found.' });
  res.status(204).end();
}
