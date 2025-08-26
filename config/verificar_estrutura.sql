-- Verificar estrutura da tabela escolas
DESCRIBE escolas;

-- Verificar se as tabelas de relacionamento existem
SHOW TABLES LIKE 'escola_tipos_ensino';
SHOW TABLES LIKE 'escola_turnos';
SHOW TABLES LIKE 'escola_redes';

-- Verificar se as tabelas de catálogo existem
SHOW TABLES LIKE 'tipos_ensino';
SHOW TABLES LIKE 'turnos';
SHOW TABLES LIKE 'redes';

-- Verificar dados nas tabelas de catálogo
SELECT * FROM tipos_ensino;
SELECT * FROM turnos;
SELECT * FROM redes;

-- Verificar se a coluna id_usuario existe na tabela escolas
SHOW COLUMNS FROM escolas LIKE 'id_usuario';

-- Verificar o tipo da coluna cnpj na tabela escolas
SHOW COLUMNS FROM escolas WHERE Field = 'cnpj';
