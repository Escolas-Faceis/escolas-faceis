const mysql = require('mysql2/promise');
require('dotenv').config();

async function testarConexao() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    console.log("Conexão bem-sucedida!");
    await conn.end();
  } catch (err) {
    console.error("Erro na conexão:", err);
  }
}

testarConexao();
