const multer = require('multer');
const path = require('path');

// Configuração do armazenamento
const storage = multer.memoryStorage(); // Armazena o arquivo em memória para manipular como buffer

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Aceita arquivos de imagem
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos!'), false); // Rejeita outros tipos de arquivo
  }
};

const upload = multer({ storage });

module.exports = upload;
