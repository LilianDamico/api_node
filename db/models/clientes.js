'use strict';
const { Model } = require('sequelize');
const argon2 = require('argon2');

module.exports = (sequelize, DataTypes) => {
  class Clientes extends Model {
    static associate(models) {
      // Relacionamento com Login
      this.hasOne(models.Login, {
        foreignKey: 'email',
        sourceKey: 'email',
        as: 'login',
        onDelete: 'CASCADE', // Exclui login associado quando o cliente é excluído
      });
    }
  }

  Clientes.init(
    {
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Nome não pode ser vazio' },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: { msg: 'E-mail inválido' },
          notEmpty: { msg: 'E-mail não pode ser vazio' },
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
      modelName: 'Clientes',
      tableName: 'Clientes',
      timestamps: true,
      hooks: {
        beforeCreate: async (cliente) => {
          if (cliente.senha) {
            cliente.senha = await argon2.hash(cliente.senha, {
              type: argon2.argon2id,
              memoryCost: 2 ** 16,
              timeCost: 3,
              parallelism: 4,
            });
          }
        },
        beforeUpdate: async (cliente) => {
          if (cliente.senha && cliente.changed('senha')) {
            cliente.senha = await argon2.hash(cliente.senha, {
              type: argon2.argon2id,
              memoryCost: 2 ** 16,
              timeCost: 3,
              parallelism: 4,
            });
          }
        },
      },
    }
  );

  return Clientes;
};
