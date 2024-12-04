'use strict';

module.exports = (sequelize, DataTypes) => {
  const Alimento = sequelize.define('Alimento', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    calorias: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    tableName: 'alimentos',
    timestamps: false, // Remova se não precisar de createdAt/updatedAt
  });

  return Alimento;
};
