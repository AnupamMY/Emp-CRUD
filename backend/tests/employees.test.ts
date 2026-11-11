import assert from 'node:assert/strict';
import { once } from 'node:events';
import path from 'node:path';
import test from 'node:test';
import dotenv from 'dotenv';
import app from '../src/app';
import connectDB, { getDB } from '../src/config/db';

dotenv.config({ path: path.join(__dirname, '../.env') });

test('employee API supports CRUD, validation, search, pagination, and CORS', async () => {
  await connectDB();
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  const baseURL = `http://127.0.0.1:${address.port}`;
  const email = `api-test-${Date.now()}@example.com`;
  const input = { name: `API Test ${Date.now()}`, email, role: 'Developer' };
  let id: string | undefined;

  async function request(route: string, method = 'GET', body?: unknown) {
    return fetch(`${baseURL}${route}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:5173',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  try {
    const invalid = await request('/employees', 'POST', {});
    assert.equal(invalid.status, 400);
    assert.equal((await request('/employees/abc', 'DELETE')).status, 400);

    const created = await request('/employees', 'POST', input);
    assert.equal(created.status, 201);
    assert.equal(
      created.headers.get('access-control-allow-origin'),
      'http://localhost:5173',
    );
    const employee = await created.json();
    id = employee.id;
    assert.equal(typeof id, 'string');
    assert.equal(employee.email, email);
    assert.ok(employee.created_at);
    assert.equal((await request('/employees', 'POST', input)).status, 409);

    const updated = await request(`/employees/${id}`, 'PUT', {
      ...input,
      role: 'Designer',
    });
    assert.equal(updated.status, 200);
    assert.equal((await updated.json()).role, 'Designer');

    const listed = await request(
      `/employees?search=${encodeURIComponent(input.name)}&page=99&limit=1`,
    );
    assert.equal(listed.status, 200);
    const page = await listed.json();
    assert.equal(page.total, 1);
    assert.equal(page.page, 1);
    assert.equal(page.employees[0].id, id);

    assert.equal((await request(`/employees/${id}`, 'DELETE')).status, 204);
    assert.equal((await request(`/employees/${id}`, 'PUT', input)).status, 404);
    assert.equal((await request(`/employees/${id}`, 'DELETE')).status, 404);
  } finally {
    await getDB().execute('DELETE FROM employees WHERE email = ?', [email]);
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
    await getDB().end();
  }
});
