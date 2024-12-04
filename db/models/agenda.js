'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Agenda extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'cpf',
        targetKey: 'cpf',
        as: 'user',
        onDelete: 'CASCADE',
      });
    }
  }

  Agenda.init(
    {
      titulo: { type: DataTypes.STRING, allowNull: false },
      descricao: { type: DataTypes.TEXT, allowNull: true },
      data: { type: DataTypes.DATEONLY, allowNull: false },
      hora: { type: DataTypes.TIME, allowNull: false },
      status: {
        type: DataTypes.ENUM('pendente', 'confirmado', 'cancelado'),
        allowNull: false,
        defaultValue: 'pendente',
      },
      cpf: {
        type: DataTypes.STRING(11),
        allowNull: false,
        references: {
          model: 'Users',
          key: 'cpf',
        },
      },
      expirationTime: { // Campo para controle de tempo
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Agenda',
      tableName: 'Agenda',
    }
  );

  return Agenda;
};
