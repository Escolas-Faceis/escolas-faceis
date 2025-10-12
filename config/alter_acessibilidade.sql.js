const pool = require('./pool_conexoes');

async function alterTable() {
    try {
        const [result] = await pool.query(`
            ALTER TABLE escolas 
            ADD COLUMN IF NOT EXISTS acessibilidade VARCHAR(255) NULL AFTER rede
        `);
        console.log('Table altered successfully:', result);
        process.exit(0);
    } catch (error) {
        console.error('Error altering table:', error);
        process.exit(1);
    }
}

alterTable();
