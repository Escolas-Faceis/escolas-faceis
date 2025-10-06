const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT, 
  waitForConnections: true,
  connectionLimit: 10,     
  queueLimit: 0,
  connectTimeout: 10000      
});

pool.getConnection((err, conn) => {
  if (err) {
    console.error('Erro na conexão com o banco:', err);
  } else {
    console.log('Conectado ao SGBD!');
    conn.release();
  }
});

module.exports = pool.promise();
