const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const argon2 = require('argon2');
const Clientes = require('../db/models').Clientes;

const router = express.Router();

// Configuração do transportador de email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Endpoint: Enviar email de recuperação
router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'E-mail é obrigatório.' });
  }

  try {
    console.log(`Recebendo solicitação de recuperação para o email: ${email}`);

    // Verifica se o email está cadastrado
    const cliente = await Clientes.findOne({ where: { email } });
    if (!cliente) {
      console.warn(`Cliente não encontrado para o email: ${email}`);
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }

    console.log(`Cliente encontrado: ${cliente.email}`);

    // Gera um token JWT com validade de 1 hora
    const token = jwt.sign(
      { email: cliente.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Link de redefinição de senha
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    // Configura o email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperação de Senha',
      html: `
        <h1>Recuperação de Senha</h1>
        <p>Olá,</p>
        <p>Recebemos uma solicitação para redefinir sua senha. Clique no link abaixo para continuar:</p>
        <a href="${resetLink}">Redefinir Senha</a>
        <p>Se você não solicitou essa ação, ignore este email.</p>
        <p>O link é válido por 1 hora.</p>
      `,
    };

    // Envia o email
    await transporter.sendMail(mailOptions);

    console.log(`E-mail enviado com sucesso para: ${email}`);
    res.status(200).json({ message: 'E-mail enviado com sucesso.' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ message: 'Erro ao enviar email.' });
  }
});

// Endpoint: Redefinir senha
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token e nova senha são obrigatórios.' });
  }

  try {
    console.log(`Recebendo solicitação para redefinir senha com token.`);

    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Encontra o cliente no banco de dados
    const cliente = await Clientes.findOne({ where: { email } });
    if (!cliente) {
      console.warn(`Cliente não encontrado para o email: ${email}`);
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }

    console.log(`Cliente encontrado para redefinir senha: ${cliente.email}`);

    // Gera o hash da nova senha
    const hashedPassword = await argon2.hash(newPassword);

    // Atualiza a senha no banco de dados
    cliente.senha = hashedPassword;
    await cliente.save();

    console.log(`Senha redefinida com sucesso para: ${cliente.email}`);
    res.status(200).json({ message: 'Senha redefinida com sucesso.' });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'O token expirou. Solicite novamente a recuperação de senha.' });
    }

    res.status(400).json({ message: 'Token inválido ou expirado.' });
  }
});

module.exports = router;
