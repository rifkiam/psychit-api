import { body } from 'express-validator';

export const articlePostRules = [
  body('title').isString().exists(),
  body('content').isString().exists(),
  body('author').isString().exists()
];

export const articlePatchRules = [
  body('title').isString().optional(),
  body('content').isString().optional(),
  body('author').isString().optional()
];
