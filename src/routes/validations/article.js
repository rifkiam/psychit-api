import { body, param } from 'express-validator';

export const articlePostRules = [
  body('title').isString().exists(),
  body('content').isString().exists(),
  body('author').isString().exists(),
  param('id').isNumeric().exists()
];
