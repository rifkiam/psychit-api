// src/routes/article.js
import { Router } from 'express';
import * as articleController from '@/controllers/article';
import * as articleRules from '@/routes/validations/article';
import { isAuthenticated, isAdmin, validate } from '@/middleware';

const router = Router();

router.route('/')
  .get(isAuthenticated, articleController.getArticles)
  .post(isAuthenticated, isAdmin, validate(articleRules.articlePostRules), articleController.insertArticle);

router.route('/:id')
  .get(isAuthenticated, articleController.getArticleById)
  .delete(isAdmin, articleController.deleteArticle)
  .patch(isAuthenticated, isAdmin, validate(articleRules.articlePostRules), articleController.updateArticle);

export default router;
