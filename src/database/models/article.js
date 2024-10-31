import { DataTypes, Model } from 'sequelize';

export default function (sequelize) {
  class Article extends Model {}

  Article.init({
    title: {
      allowNull: false,
      type: DataTypes.STRING(100),
    },
    content: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    author: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
    filePath: {
      allowNull: true,
      type: DataTypes.STRING(255),
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {
    modelName: 'article',
    tableName: 'articles',
    paranoid: false,
    sequelize,
  });

  return Article;
}
