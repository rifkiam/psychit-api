import createError from 'http-errors';

import db from '@/database';
import { Op, where } from 'sequelize';
import path from 'path';
import fs from 'fs';

export const getArticles = async (req, res, next) => {
  try {
    const articles = await db.models.article.findAll();
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

    const article = await db.models.article.create(
      { 
        title: req.body.title, 
        content: req.body.content, 
        author: req.body.author, 
        filePath: req.file.destination + req.file.filename
      }
    );

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

    if (req.body.title) {
      const existingTitle = await db.models.article.findOne({ 
        where: { 
          title: req.body.title,
          id: { [Op.not]: req.params.id } 
        } 
      });
      if (existingTitle) return next(createError(400, 'Terdapat artikel dengan judul yang sama.'));
    }

    if (req.file && existingTitleId.filePath) {
      const existingFilePath = path.join(existingTitleId.filePath);
      fs.unlink(existingFilePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err); 
          alert("Error deleting file:");
        } 
      });
    }

    // const article = await db.models.article.update(req.body, { fields: ['title', 'content', 'author'], where: { id: req.params.id } });
    const article = await db.models.article.update(
      {
        title: req.body.title ? req.body.title : existingTitleId.title, 
        content: req.body.content ? req.body.content : existingTitleId.content, 
        author: req.body.author ? req.body.author : existingTitleId.author, 
        filePath: req.file ? req.file.destination + req.file.filename : existingTitleId.filePath
      },
      {
        where: { id: req.params.id }
      }
    );

    res.status(200).json({ 
      success: true, 
      message: 'Artikel berhasil diperbarui!', 
      data: { 
        id: req.params.id, 
        title: req.body.title ? req.body.title : existingTitleId.title, 
        content: req.body.content ? req.body.content : existingTitleId.content, 
        author: req.body.author ? req.body.author : existingTitleId.author, 
        filePath: req.file ? req.file.destination + req.file.filename : existingTitleId.filePath 
      } 
    });
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

    const existingFilePath = path.join(article.filePath);
      fs.unlink(existingFilePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          alert("Error deleting file:");
        } 
      });

    const deleteArticle = await db.models.article.destroy({ where: { id: parseInt(req.params.id) } });

    res.status(200).json({ success: true, message: 'Artikel berhasil dihapus!' })
  }
  catch (e) {
    console.log(e)
    return next(e);
  }
}
