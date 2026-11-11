# Employee Directory
A simple app to add, view, edit, and delete employees. You can also search employees by name and move between pages.

Built with React, TypeScript, Axios, Node.js, Express, and MySQL.

## Setup
You need Node.js 22.12 or later and MySQL 8 or later.
1. Start MySQL. If you use Laragon, click Start All.
2. Open `backend/setup.sql`, replace `replace_with_your_password` with your chosen password, and run it in your MySQL client as an administrator.
3. Copy `backend/.env.example` to `backend/.env`. Set the database password to the one you used above. If you already have a working `.env`, keep it.

The backend creates the employees table when it starts. If the `employee_app` user already exists, the SQL script keeps its existing password.

Start the backend:
cd backend
npm install
npm run dev

Open another terminal and start the frontend:
cd frontend
npm install
npm run dev

Open http://localhost:5173. The backend runs on http://localhost:5000.
## API
GET /employees List employees
POST /employees Add an employee 
PUT  /employees/:id Edit an employee 
DELETE  /employees/:id  Delete an employee

POST and PUT use this JSON format:
{
  "name": "Anupam Yadav",
  "email": "anupam@example.com",
  "role": "Developer"
}

For search and pagination, use `/employees?search=anupam&page=1&limit=5`. The response includes `employees`, `total`, `page`, and `totalPages`.

## Database
The `employee_db` database has an `employees` table:
id  INT UNSIGNED, primary key, auto increment 
name  VARCHAR(100) 
email VARCHAR(254), unique 
role  VARCHAR(32) 
created_at  TIMESTAMP(3), set automatically 

Name, email, and role are required.
## Checks

In `backend`:

npm run typecheck
npm run build
npm test

Keep MySQL running for the API test. It removes its test employee afterward.

In `frontend`:
npm run build


If the app cannot connect, check that MySQL and the backend are running and that the credentials in `backend/.env` are correct.

Do not upload `.env` or `node_modules` to GitHub. The project includes `.gitignore` for these files.
