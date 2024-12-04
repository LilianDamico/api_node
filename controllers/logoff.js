const express = require('express');
const { addToBlacklist } = require('../services/logoff');
const router = express.Router();

// Rota POST - Logoff
router.post('/', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: true,
      message: 'Token ausente. Faça login novamente.',
    });
  }

  const [, token] = authHeader.split(' ');

  addToBlacklist(token);

  return res.status(200).json({
    error: false,
    message: 'Logoff realizado com sucesso.',
  });
});

module.exports = router;
