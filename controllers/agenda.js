const express = require('express');
const router = express.Router();
const { Agenda, Users } = require('../db/models/index');

// **Criar um novo compromisso**
router.post('/', async (req, res) => {
  const { titulo, descricao, data, hora, status, cpf, expirationTime } = req.body;

  try {
    // Verifica se o usuário associado existe
    const user = await Users.findOne({ where: { cpf } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    // Cria o compromisso
    const agenda = await Agenda.create({
      titulo,
      descricao,
      data,
      hora,
      status: status || 'pendente',
      cpf,
      expirationTime,
    });

    return res.status(201).json({ success: true, message: 'Compromisso criado com sucesso.', agenda });
  } catch (error) {
    console.error('Erro ao criar compromisso:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
});

// **Listar compromissos**
router.get('/', async (req, res) => {
  try {
    const compromissos = await Agenda.findAll({
      include: {
        model: Users,
        as: 'user',
        attributes: ['nome', 'email', 'cpf'],
      },
    });

    return res.status(200).json({ success: true, compromissos });
  } catch (error) {
    console.error('Erro ao listar compromissos:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
});

// **Buscar compromisso por ID**
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const compromisso = await Agenda.findByPk(id, {
      include: {
        model: Users,
        as: 'user',
        attributes: ['nome', 'email', 'cpf'],
      },
    });

    if (!compromisso) {
      return res.status(404).json({ success: false, message: 'Compromisso não encontrado.' });
    }

    return res.status(200).json({ success: true, compromisso });
  } catch (error) {
    console.error('Erro ao buscar compromisso:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
});

// **Atualizar compromisso**
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, data, hora, status, expirationTime } = req.body;

  try {
    const compromisso = await Agenda.findByPk(id);

    if (!compromisso) {
      return res.status(404).json({ success: false, message: 'Compromisso não encontrado.' });
    }

    await compromisso.update({
      titulo,
      descricao,
      data,
      hora,
      status,
      expirationTime,
    });

    return res.status(200).json({ success: true, message: 'Compromisso atualizado com sucesso.', compromisso });
  } catch (error) {
    console.error('Erro ao atualizar compromisso:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
});

// **Excluir compromisso**
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const compromisso = await Agenda.findByPk(id);

    if (!compromisso) {
      return res.status(404).json({ success: false, message: 'Compromisso não encontrado.' });
    }

    await compromisso.destroy();
    return res.status(200).json({ success: true, message: 'Compromisso excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir compromisso:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
});

module.exports = router;

