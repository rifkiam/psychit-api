// src/routes/article.js
import { Router } from 'express';
import * as articleController from '@/controllers/article';
import * as articleRules from '@/routes/validations/article';
import { isAuthenticated, isAdmin, validate } from '@/middleware';
import { upload } from '@/helpers/fileUpload';

const router = Router();

router.route('/')
  .get(isAuthenticated, articleController.getArticles)
  .post(isAuthenticated, isAdmin, upload.single('image'), validate(articleRules.articlePostRules), articleController.insertArticle);

router.route('/:id')
  .get(isAuthenticated, articleController.getArticleById)
  .delete(isAdmin, articleController.deleteArticle)
  .patch(isAuthenticated, isAdmin, upload.single('image'), validate(articleRules.articlePatchRules), articleController.updateArticle);

export default router;
