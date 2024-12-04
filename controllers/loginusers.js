const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { LoginUsers, Users } = require('../db/models/index'); 
const argon2 = require('argon2');

// Obtenha as variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '1h';

/**
 * Rota para autenticar usuário pelo CPF e senha.
 */
router.post('/', async (req, res) => {
  const { cpf, senha } = req.body;

  try {
    // Verifica se CPF e senha foram fornecidos
    if (!cpf || !senha) {
      return res.status(400).json({ message: 'CPF e senha são obrigatórios!' });
    }

    // Busca o usuário na tabela Users
    const user = await Users.findOne({
      where: { cpf },
      attributes: ['cpf', 'senha'], // Traz apenas os campos necessários
    });

    // Verifica se o usuário foi encontrado
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    // Verifica se a senha está correta
    const isPasswordValid = await argon2.verify(user.senha, senha);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha incorreta!' });
    }

    // Gera o token JWT
    const token = jwt.sign({ cpf: user.cpf }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRATION,
    });

    // Sucesso na autenticação
    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      token,
    });
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor!' });
  }
});

module.exports = router;
