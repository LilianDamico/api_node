'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Uploads extends Model {
    static associate(models) {
      // Relaciona uploads a usuários
      this.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  Uploads.init(
    {
      originalName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filePath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mimeType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Uploads',
    }
  );

  return Uploads;
};
