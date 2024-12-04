const express = require('express');
const router = express.Router();
const { Clientes, Login } = require('../db/models'); // Substitua pelo caminho correto para acessar as models
const argon2 = require('argon2');

// CREATE - Criar um novo cliente
router.post('/', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Verifica se o email já está cadastrado
    const existingClient = await Clientes.findOne({ where: { email } });
    if (existingClient) {
      return res.status(400).json({ error: true, message: 'E-mail já cadastrado' });
    }

    // Cria o cliente
    const newClient = await Clientes.create({ nome, email, senha });

    res.status(201).json({ success: true, cliente: newClient });
  } catch (error) {
    console.error('[CLIENTE CREATE ERROR]:', error.message);
    res.status(500).json({ error: true, message: 'Erro ao criar o cliente' });
  }
});

// READ - Listar todos os clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Clientes.findAll({
      attributes: { exclude: ['senha'] },
    });

    res.status(200).json({ success: true, clientes });
  } catch (error) {
    console.error('[CLIENTE READ ERROR]:', error.message);
    res.status(500).json({ error: true, message: 'Erro ao buscar os clientes' });
  }
});

// READ - Buscar cliente por e-mail
router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const cliente = await Clientes.findOne({
      where: { email },
      attributes: { exclude: ['senha'] },
      include: {
        model: Login,
        as: 'login',
        attributes: ['status', 'ip', 'timestamp'], // Campos do login associado
      },
    });

    if (!cliente) {
      return res.status(404).json({ error: true, message: 'Cliente não encontrado' });
    }

    res.status(200).json({ success: true, cliente });
  } catch (error) {
    console.error('[CLIENTE READ ONE ERROR]:', error.message);
    res.status(500).json({ error: true, message: 'Erro ao buscar o cliente' });
  }
});

// UPDATE - Atualizar dados do cliente
router.put('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const updates = req.body;

    // Atualiza os dados do cliente
    const [updated] = await Clientes.update(updates, { where: { email } });

    if (!updated) {
      return res.status(404).json({ error: true, message: 'Cliente não encontrado para atualização' });
    }

    const updatedClient = await Clientes.findOne({
      where: { email },
      attributes: { exclude: ['senha'] },
    });

    res.status(200).json({ success: true, cliente: updatedClient });
  } catch (error) {
    console.error('[CLIENTE UPDATE ERROR]:', error.message);
    res.status(500).json({ error: true, message: 'Erro ao atualizar o cliente' });
  }
});

// DELETE - Excluir cliente
router.delete('/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const deleted = await Clientes.destroy({ where: { email } });
    if (!deleted) {
      return res.status(404).json({ error: true, message: 'Cliente não encontrado para exclusão' });
    }

    res.status(200).json({ success: true, message: 'Cliente excluído com sucesso' });
  } catch (error) {
    console.error('[CLIENTE DELETE ERROR]:', error.message);
    res.status(500).json({ error: true, message: 'Erro ao excluir o cliente' });
  }
});

module.exports = router;
