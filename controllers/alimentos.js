const express = require('express');
const router = express.Router();
const { Alimento } = require('../db/models');

// Rota para listar todos os alimentos
router.get('/', async (req, res) => {
  try {
    const alimentos = await Alimento.findAll();
    res.status(200).json(alimentos);
  } catch (error) {
    console.error('Erro ao listar alimentos:', error);
    res.status(500).json({ error: 'Erro ao listar alimentos.' });
  }
});

// Rota para buscar um alimento por nome (novo comportamento)
router.get('/buscar', async (req, res) => {
  const { nome } = req.body; // Extrai o nome do corpo da requisição
  try {
    if (!nome) {
      return res.status(400).json({ error: 'O parâmetro "nome" é obrigatório.' });
    }

    const alimento = await Alimento.findOne({ where: { nome } });
    if (!alimento) {
      return res.status(404).json({ error: 'Alimento não encontrado.' });
    }
    res.status(200).json(alimento);
  } catch (error) {
    console.error('Erro ao buscar alimento por nome:', error);
    res.status(500).json({ error: 'Erro ao buscar alimento.' });
  }
});


// Rota para buscar um alimento por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const alimento = await Alimento.findByPk(id);
    if (!alimento) {
      return res.status(404).json({ error: 'Alimento não encontrado.' });
    }
    res.status(200).json(alimento);
  } catch (error) {
    console.error('Erro ao buscar alimento por ID:', error);
    res.status(500).json({ error: 'Erro ao buscar alimento.' });
  }
});

// Rota para criar um novo alimento
router.post('/', async (req, res) => {
  const { nome, calorias } = req.body;
  try {
    const novoAlimento = await Alimento.create({
      nome,
      calorias,
    });
    res.status(201).json(novoAlimento);
  } catch (error) {
    console.error('Erro ao criar alimento:', error);
    res.status(500).json({ error: 'Erro ao criar alimento.' });
  }
});

// Rota para atualizar um alimento por ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, calorias } = req.body;
  try {
    const alimento = await Alimento.findByPk(id);
    if (!alimento) {
      return res.status(404).json({ error: 'Alimento não encontrado.' });
    }
    await alimento.update({
      nome,
      calorias,
    });
    res.status(200).json(alimento);
  } catch (error) {
    console.error('Erro ao atualizar alimento:', error);
    res.status(500).json({ error: 'Erro ao atualizar alimento.' });
  }
});

// Rota para excluir um alimento por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const alimento = await Alimento.findByPk(id);
    if (!alimento) {
      return res.status(404).json({ error: 'Alimento não encontrado.' });
    }
    await alimento.destroy();
    res.status(204).send(); // Sem conteúdo após exclusão
  } catch (error) {
    console.error('Erro ao excluir alimento:', error);
    res.status(500).json({ error: 'Erro ao excluir alimento.' });
  }
});

module.exports = router;
