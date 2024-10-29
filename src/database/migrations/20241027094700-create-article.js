export const up = (queryInterface, Sequelize) => queryInterface.createTable('articles', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  title: {
    allowNull: false,
    type: Sequelize.STRING(100),
  },
  content: {
    allowNull: false,
    type: Sequelize.TEXT,
  },
  author: {
    allowNull: false,
    type: Sequelize.STRING(50),
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
});

export const down = (queryInterface) => queryInterface.dropTable('articles');
