require('dotenv').config(); // Carregar variáveis do arquivo .env
const fs = require('fs');
const { Client } = require('pg');

// Configuração do cliente PostgreSQL usando variáveis de ambiente
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_BASE,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

const importarCSV = async () => {
  try {
    await client.connect();
    console.log('Conexão com o banco de dados realizada com sucesso.');

    const csvPath = 'C:\Users\Lilian Maria\Desktop\integracao\api-node\importarCSV.js';
    const csvData = fs.readFileSync(csvPath, 'utf-8');

    // Dividir os dados do CSV em linhas
    const linhas = csvData.split('\n').slice(1); // Ignorar o cabeçalho
    for (const linha of linhas) {
      const [id, nome, calorias] = linha.split(',');
      if (id && nome && calorias) {
        await client.query(
          'INSERT INTO public.alimentos (id, nome, calorias) VALUES ($1, $2, $3)',
          [parseInt(id), nome.replace(/"/g, ''), parseFloat(calorias)]
        );
      }
    }

    console.log('Dados importados com sucesso!');
  } catch (error) {
    console.error('Erro ao importar dados:', error);
  } finally {
    await client.end();
    console.log('Conexão com o banco encerrada.');
  }
};

importarCSV();
