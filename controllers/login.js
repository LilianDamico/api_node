const express = require('express');
const router = express.Router();
const { Clientes } = require('../db/models/index'); // Modelo do Sequelize para a tabela Clientes
const argon2 = require('argon2');

router.post('/', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Verifica se os campos foram enviados
    if (!email || !senha) {
      return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios.' });
    }

    // Busca o usuário pelo email
    const user = await Clientes.findOne({
      where: { email },
      attributes: ['email', 'senha', 'nome'], // Traz apenas os campos necessários
    });

    // Verifica se o usuário foi encontrado
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    // Valida a senha usando argon2
    const validPassword = await argon2.verify(user.senha, senha);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Senha incorreta.' });
    }

    // Retorna sucesso
    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso!',
      user: {
        nome: user.nome,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Erro na rota de login:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
});

module.exports = router;
