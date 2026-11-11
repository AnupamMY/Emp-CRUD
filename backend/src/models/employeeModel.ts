import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { getDB } from '../config/db';
import type { EmployeeInput } from '../validation/employee';

interface EmployeeRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: Date;
}

function serialize(row: EmployeeRow) {
  return { ...row, id: String(row.id) };
}

const Employee = {
  async list(search: string, limit: number, requestedPage: number) {
    const where = search ? ' WHERE LOCATE(?, name) > 0' : '';
    const params = search ? [search] : [];
    const [counts] = await getDB().execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM employees${where}`,
      params,
    );
    const total = Number(counts[0].total);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const page = Math.min(totalPages, requestedPage);
    const [rows] = await getDB().execute<EmployeeRow[]>(
      `SELECT * FROM employees${where} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
      [...params, String(limit), String((page - 1) * limit)],
    );
    return { employees: rows.map(serialize), total, page, totalPages };
  },
  async findById(id: string) {
    const [rows] = await getDB().execute<EmployeeRow[]>(
      'SELECT * FROM employees WHERE id = ?',
      [id],
    );
    return rows[0] ? serialize(rows[0]) : null;
  },
  async create(input: EmployeeInput) {
    const [result] = await getDB().execute<ResultSetHeader>(
      'INSERT INTO employees (name, email, role) VALUES (?, ?, ?)',
      [input.name, input.email, input.role],
    );
    return Employee.findById(String(result.insertId));
  },
  async update(id: string, input: EmployeeInput) {
    await getDB().execute<ResultSetHeader>(
      'UPDATE employees SET name = ?, email = ?, role = ? WHERE id = ?',
      [input.name, input.email, input.role, id],
    );
    return Employee.findById(id);
  },
  async delete(id: string) {
    const [result] = await getDB().execute<ResultSetHeader>(
      'DELETE FROM employees WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  },
};

export default Employee;
