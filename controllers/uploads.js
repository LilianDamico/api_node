const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db/models/index'); // Importa as models
const router = express.Router();

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});

// Rota para upload de arquivo
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: true, message: 'Nenhum arquivo enviado.' });
    }

    const { originalname, mimetype, size, filename } = req.file;
    const filePath = `/uploads/${filename}`;

    // Salva no banco de dados
    const upload = await db.Uploads.create({
      originalName: originalname,
      filePath,
      mimeType: mimetype,
      size,
      userId: req.body.userId || null, // Relaciona ao usuário, se fornecido
    });

    res.status(200).json({
      error: false,
      message: 'Upload realizado com sucesso!',
      upload,
    });
  } catch (error) {
    console.error(`[UPLOAD ERROR]: ${error.message}`);
    res.status(500).json({ error: true, message: 'Erro ao fazer upload.', details: error.message });
  }
});

module.exports = router;
