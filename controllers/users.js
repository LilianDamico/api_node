const express = require('express');
const router = express.Router();
const { Users } = require('../db/models');
const argon2 = require('argon2');

// Função utilitária para validação de CPF
const validateCPF = (cpf) => /^[0-9]{11}$/.test(cpf);

// Função utilitária para tratamento de erros
const handleError = (res, message, status = 500) => res.status(status).json({ error: true, message });

// CREATE - Criação de um novo usuário
router.post('/', async (req, res) => {
  try {
    const { nome, cpf, email, senha, registro, endereco, telefone, profissao, especialidade, comentarios } = req.body;

    if (!validateCPF(cpf)) {
      return handleError(res, 'CPF inválido.', 400);
    }

    const existingUser = await Users.findOne({ where: { cpf } }) || await Users.findOne({ where: { email } });
    if (existingUser) {
      return handleError(res, 'Usuário já cadastrado com este CPF ou email.', 400);
    }

    const newUser = await Users.create({
      nome,
      cpf,
      email,
      senha,
      registro,
      endereco,
      telefone,
      profissao,
      especialidade,
      comentarios,
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error('[CREATE ERROR]:', error.message);
    handleError(res, 'Erro ao criar o usuário.');
  }
});

// READ - Listagem de todos os usuários com paginação
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const users = await Users.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: { exclude: ['senha'] },
    });

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('[READ ERROR]:', error.message);
    handleError(res, 'Erro ao buscar os usuários.');
  }
});

// READ - Buscar um usuário por CPF
router.get('/:cpf', async (req, res) => {
  try {
    const { cpf } = req.params;

    if (!validateCPF(cpf)) {
      return handleError(res, 'CPF inválido.', 400);
    }

    const user = await Users.findOne({ where: { cpf }, attributes: { exclude: ['senha'] } });

    if (!user) {
      return handleError(res, 'Usuário não encontrado.', 404);
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('[READ ONE ERROR]:', error.message);
    handleError(res, 'Erro ao buscar o usuário.');
  }
});

// UPDATE - Atualizar um usuário
router.put('/:cpf', async (req, res) => {
  try {
    const { cpf } = req.params;
    const updates = req.body;

    if (!validateCPF(cpf)) {
      return handleError(res, 'CPF inválido.', 400);
    }

    const [updated] = await Users.update(updates, { where: { cpf } });

    if (!updated) {
      return handleError(res, 'Usuário não encontrado para atualização.', 404);
    }

    const updatedUser = await Users.findOne({ where: { cpf }, attributes: { exclude: ['senha'] } });
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('[UPDATE ERROR]:', error.message);
    handleError(res, 'Erro ao atualizar o usuário.');
  }
});

// DELETE - Excluir um usuário
router.delete('/:cpf', async (req, res) => {
  try {
    const { cpf } = req.params;

    if (!validateCPF(cpf)) {
      return handleError(res, 'CPF inválido.', 400);
    }

    const deleted = await Users.destroy({ where: { cpf } });

    if (!deleted) {
      return handleError(res, 'Usuário não encontrado para exclusão.', 404);
    }

    res.status(200).json({ success: true, message: 'Usuário excluído com sucesso.' });
  } catch (error) {
    console.error('[DELETE ERROR]:', error.message);
    handleError(res, 'Erro ao excluir o usuário.');
  }
});

module.exports = router;
