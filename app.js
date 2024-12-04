require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const app = express();

// Inicializa a conexão com o banco de dados
require('./db/models/index');

// Configuração do multer para upload de arquivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de tamanho: 10 MB
});

// Middlewares globais
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));


const corsOptions = {
  origin: '*',  // Permite todas as origens
  credentials: true,  
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  
  allowedHeaders: ['Content-Type', 'Authorization'],  
};

app.use(cors(corsOptions));


// Middleware para servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importação das controllers
const home = require('./controllers/home');
const users = require('./controllers/users');
const login = require('./controllers/login');
const logoff = require('./controllers/logoff');
const clientes = require('./controllers/clientes');
const alimentos = require('./controllers/alimentos');
const password_recovery = require('./controllers/password_recovery');
const agenda = require('./controllers/agenda');
const loginusers = require('./controllers/loginusers');

// Registro das rotas
app.use('/home', home);
app.use('/users', users);
app.use('/login', login);
app.use('/logoff', logoff);
app.use('/clientes', clientes);
app.use('/alimentos', alimentos);
app.use('/password_recovery', password_recovery);
app.use('/agenda', agenda);
app.use('/loginusers', loginusers);

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(`[ERROR]: ${err.message}`);
  res.status(500).json({
    error: true,
    message: 'Erro interno do servidor. Por favor, tente novamente mais tarde.',
  });
});

// Inicialização do servidor
const startServer = () => {
  const PORT = process.env.PORT || 8081;
  app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
    console.log(`Rotas disponíveis:`);
    console.log(`  - Home: GET http://localhost:${PORT}/home`);
    console.log(`  - Users: CRUD http://localhost:${PORT}/users`);
    console.log(`  - Login: POST http://localhost:${PORT}/login`);
    console.log(`  - Logoff: POST http://localhost:${PORT}/logoff`);
    console.log(`  - Clientes: CRUD http://localhost:${PORT}/clientes`);
    console.log(`  - Alimentos: CRUD http://localhost:${PORT}/alimentos`);
    console.log(`  - Password Recovery:`);
    console.log(`      * POST http://localhost:${PORT}/password_recovery`);
    console.log(`      * POST http://localhost:${PORT}/password_recovery/reset-password`);
    console.log(`  - Upload: POST http://localhost:${PORT}/upload`);
    console.log(`  - Agenda: CRUD http://localhost:${PORT}/agenda`);
  });
};

startServer();
