import type { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err.code === 'ER_DUP_ENTRY') {
    return res
      .status(409)
      .json({ message: 'An employee with this email already exists.' });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body.' });
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Request body is too large.' });
  }

  console.error(err.message);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
};

export default errorHandler;
