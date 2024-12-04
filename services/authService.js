const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const db = require('../db/models/index');
const { isTokenBlacklisted } = require('./logoff'); // Certifique-se de que o caminho esteja correto

module.exports = {
  eAdmin: async function (req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: true,
        message: 'Token ausente. Faça login novamente.',
      });
    }

    const [, token] = authHeader.split(' ');

    // Verifica se o token está na blacklist
    if (isTokenBlacklisted(token)) {
      return res.status(401).json({
        error: true,
        message: 'Token inválido ou expirado.',
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await db.Users.findByPk(decoded.id);

      if (!user) {
        return res.status(404).json({
          error: true,
          message: 'Usuário não encontrado.',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        error: true,
        message: 'Token inválido ou expirado.',
      });
    }
  },
};
