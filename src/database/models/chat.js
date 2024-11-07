import { DataTypes, Model } from 'sequelize';

export default function (sequelize) {
  class Chat extends Model {}

  Chat.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sessionId: {
      type: DataTypes.STRING, // Add this to track session ID
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    messages: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [], // Initialize as an empty array to store messages
    },
    stream: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    modelName: 'Chat',
    tableName: 'chats',
    sequelize,
    paranoid: true,  // Enables soft deletion
    timestamps: true, // Auto-sets createdAt and updatedAt fields
  });

  return Chat;
}
