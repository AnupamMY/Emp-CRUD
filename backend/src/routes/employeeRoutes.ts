import express from 'express';

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController';

const router = express.Router();

router.route('/').get(getEmployees).post(createEmployee);

router.param('id', (req, res, next, id) => {
  if (
    !/^[1-9]\d*$/.test(id) ||
    !Number.isSafeInteger(Number(id)) ||
    Number(id) > 4294967295
  ) {
    return res.status(400).json({ message: 'Invalid employee ID.' });
  }

  next();
});

router.route('/:id').put(updateEmployee).delete(deleteEmployee);

export default router;
