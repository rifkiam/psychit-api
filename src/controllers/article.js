import createError from 'http-errors';

import db from '@/database';

export const getArticles = async (req, res, next) => {
  try {
    const articles = await db.models.article.findAll();
    console.log('logged', articles);
    if (!articles) return next(createError(400, 'Tidak ada artikel yang didapat.'));

    res.status(200).json({ success: true, message: 'Berhasil mengambil artikel!', data: articles})
  }
  catch (e) {
    console.log(e)
    return next(e);
  }
}
export const getArticleById = async (req, res, next) => {
  try {
    const article = await db.models.article.findOne({ where: { id: req.params.id } });
    if (!article) return next(createError(400, 'Tidak ada artikel yang didapat.'));

    res.status(200).json({ success: true, message: 'Berhasil mengambil artikel!', data: article})
  }
  catch (e) {
    console.log(e)
    return next(e);
  }
}
export const insertArticle = async (req, res, next) => {
  try {
    const existingTitle = await db.models.article.findOne({ where: { title: req.body.title } });
    if (existingTitle) return next(createError(400, 'Terdapat artikel dengan judul yang sama.'));

    const article = await db.models.article.create(req.body, { fields: ['title', 'content', 'author'] });

    res.status(200).json({ success: true, message: 'Artikel berhasil dibuat!', data: article });
  }
  catch (e) {
    console.log(e)
    return next(e);
  }
}
export const updateArticle = async (req, res, next) => {
  try {
    console.log("ask")
    const existingTitleId = await db.models.article.findOne({ where: { id: req.params.id } });
    if (!existingTitleId) return next(createError(404, 'Tidak ada artikel dengan id tersebut.'));

    const existingTitle = await db.models.article.findOne({ where: { title: req.body.title } });
    if (existingTitle) return next(createError(400, 'Terdapat artikel dengan judul yang sama.'));

    const article = await db.models.article.update(req.body, { fields: ['title', 'content', 'author'], where: { id: req.params.id } });

    res.status(200).json({ success: true, message: 'Artikel berhasil diperbarui!', data: { id: req.params.id, title: req.body.title, content: req.body.title, author: req.body.author } });
  }
  catch (e) {
    console.log(e)
    return next(e);
  }
}
export const deleteArticle = async (req, res, next) => {
  try {
    const article = await db.models.article.findOne({ where: { id: parseInt(req.params.id) } });
    if (!article) return next(createError(400, 'Tidak ada artikel yang didapat.'));

    const deleteArticle = await db.models.article.destroy({ where: { id: parseInt(req.params.id) } });

    res.status(200).json({ success: true, message: 'Artikel berhasil dihapus!' })
  }
  catch (e) {
    console.log(e)
    return next(e);
  }
}
