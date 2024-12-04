'use strict';
const { Model } = require('sequelize');
const argon2 = require('argon2');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      // Relacionamento com Agenda
      this.hasMany(models.Agenda, {
        foreignKey: 'cpf',
        sourceKey: 'cpf',
        as: 'agenda',
        onDelete: 'CASCADE',
      });
      
      // Relacionamento com LoginUsers
      this.hasMany(models.LoginUsers, {
        foreignKey: 'cpf',
        sourceKey: 'cpf',
        as: 'logins',
        onDelete: 'CASCADE',
      });
    }
  }

  Users.init(
    {
      nome: { type: DataTypes.STRING, allowNull: false },
      cpf: { type: DataTypes.STRING(11), allowNull: false, unique: true, primaryKey: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      senha: { type: DataTypes.STRING, allowNull: false },
      registro: { type: DataTypes.STRING, allowNull: false },
      endereco: { type: DataTypes.STRING, allowNull: false },
      telefone: { type: DataTypes.STRING(11), allowNull: false },
      profissao: { type: DataTypes.STRING, allowNull: false },
      especialidade: { type: DataTypes.STRING, allowNull: false },
      comentarios: { type: DataTypes.TEXT, allowNull: true },
      foto: { type: DataTypes.BLOB('long'), allowNull: true },
    },
    {
      sequelize,
      modelName: 'Users',
      hooks: {
        beforeCreate: async (user) => {
          if (user.senha) {
            user.senha = await argon2.hash(user.senha, {
              type: argon2.argon2id,
              memoryCost: 2 ** 16,
              timeCost: 3,
              parallelism: 4,
            });
            console.log('Hash gerado:', user.senha);
          }
        },
        beforeUpdate: async (user) => {
          if (user.senha && user.changed('senha')) {
            user.senha = await argon2.hash(user.senha, {
              type: argon2.argon2id,
              memoryCost: 2 ** 16,
              timeCost: 3,
              parallelism: 4,
            });
            console.log('Hash atualizado:', user.senha);
          }
        },
      },
    }
  );

  return Users;
};
