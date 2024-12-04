'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Login extends Model {
    static associate(models) {
      this.belongsTo(models.Clientes, {
        foreignKey: 'email',
        targetKey: 'email',
        as: 'cliente',
        onDelete: 'CASCADE', // Exclui o login quando o cliente é excluído
      });
    }
  }

  Login.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true, // Define email como chave primária
        validate: {
          isEmail: { msg: 'Email inválido' },
          notEmpty: { msg: 'Email não pode ser vazio' },
        },
      },
      senha: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Senha não pode ser vazia' },
        },
      },
    },
    {
      sequelize,
      modelName: 'Login',
      tableName: 'Logins',
      timestamps: false, // Não há necessidade de timestamps no login
    }
  );

  return Login;
};
