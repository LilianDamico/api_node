'use strict';
const { Model } = require('sequelize');
const argon2 = require('argon2');

module.exports = (sequelize, DataTypes) => {
  class LoginUsers extends Model {
    /**
     * Método para autenticar o usuário pelo CPF e senha.
     * @param {string} cpf - CPF do usuário.
     * @param {string} senha - Senha fornecida pelo usuário.
     * @param {object} models - Modelos disponíveis.
     * @returns {object|null} - Retorna o usuário autenticado ou null se falhar.
     */
    static async authenticate(cpf, senha, models) {
      // Busca o usuário na tabela Users
      const user = await models.Users.findOne({
        where: { cpf },
        attributes: ['cpf', 'senha'],
      });

      // Verifica se o usuário existe e valida a senha
      if (user && await argon2.verify(user.senha, senha)) {
        return user;
      }

      // Retorna null se a autenticação falhar
      return null;
    }

    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'cpf',
        targetKey: 'cpf',
        as: 'user',
        onDelete: 'CASCADE',
      });
    }
  }

  LoginUsers.init(
    {
      cpf: {
        type: DataTypes.STRING(11),
        allowNull: false,
        references: {
          model: 'Users',
          key: 'cpf',
        },
      },
      senha: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'LoginUsers',
      tableName: 'LoginUsers',
      timestamps: false,
    }
  );

  return LoginUsers;
};
