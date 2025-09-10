-- ========================
-- TABELA DE USUÁRIOS
-- ========================
DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone CHAR(15) NULL,
    senha VARCHAR(255) NOT NULL,
    img_perfil_pasta VARCHAR(80) DEFAULT NULL,
    img_perfil_banco LONGBLOB,
    biografia VARCHAR(255) NULL,
    tipo ENUM('Escola','Comum', 'ADM') NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    `status` INT DEFAULT 1 CHECK (status IN (0, 1)) -- 0: Inativo, 1: Ativo
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ========================
-- TABELAS AUXILIARES
-- ========================

-- Redes
DROP TABLE IF EXISTS redes;
CREATE TABLE redes (
    id_rede INT PRIMARY KEY AUTO_INCREMENT,
    nome_rede VARCHAR(50) NOT NULL UNIQUE
);

-- Tipos de ensino
DROP TABLE IF EXISTS tipos_ensino;
CREATE TABLE tipos_ensino (
    id_tipo_ensino INT PRIMARY KEY AUTO_INCREMENT,
    nome_tipo_ensino VARCHAR(50) NOT NULL UNIQUE
);

-- Turnos
DROP TABLE IF EXISTS turnos;
CREATE TABLE turnos (
    id_turno INT PRIMARY KEY AUTO_INCREMENT,
    nome_turno VARCHAR(50) NOT NULL UNIQUE
);

-- ========================
-- TABELA ESCOLAS
-- ========================
DROP TABLE IF EXISTS escolas;
CREATE TABLE escolas (
    id INT NOT NULL PRIMARY KEY, -- mesmo ID do usuário
    CONSTRAINT fk_escola_usuario FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE,
    
    -- Dados básicos
    cnpj CHAR(18) NOT NULL UNIQUE,
    cep CHAR(9) NOT NULL,
    numero VARCHAR(5) NOT NULL,
    
    -- Perfil da escola
    sobre_escola TEXT NULL,
    sobre_ensino TEXT NULL,
    sobre_estrutura TEXT NULL,
    ingresso VARCHAR(255) NULL,
    
    -- Rede
    id_rede INT NOT NULL,
    CONSTRAINT fk_escola_rede FOREIGN KEY (id_rede) REFERENCES redes(id_rede),
    
    -- Contatos
    whatsapp VARCHAR(20) NULL,
    telefone VARCHAR(20) NULL,
    instagram VARCHAR(100) NULL,
    facebook VARCHAR(100) NULL,
    email VARCHAR(100) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ========================
-- TABELA DE AVALIAÇÕES
-- ========================
DROP TABLE IF EXISTS avaliacoes;
CREATE TABLE avaliacoes(
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    id_escola INT NOT NULL,
    id_usuario INT NOT NULL,
    CONSTRAINT fk_id_escola FOREIGN KEY (id_escola) REFERENCES escolas(id),
    CONSTRAINT fk_id_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    nota TINYINT NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario VARCHAR(255) DEFAULT NULL,
    data DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ========================
-- TABELA DE IMAGENS DA GALERIA DA ESCOLA
-- ========================
DROP TABLE IF EXISTS imagens_escola;
CREATE TABLE imagens_escola (
    id_img INT PRIMARY KEY AUTO_INCREMENT,
    id_escola INT NOT NULL,
    img_pasta VARCHAR(80) DEFAULT NULL,
    img_bd LONGBLOB,
    CONSTRAINT fk_img_escola FOREIGN KEY (id_escola) REFERENCES escolas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ========================
-- RELACIONAMENTO ESCOLA ↔ TIPOS DE ENSINO
-- ========================
DROP TABLE IF EXISTS escola_tipos_ensino;
CREATE TABLE escola_tipos_ensino (
    id_escola INT NOT NULL,
    id_tipo_ensino INT NOT NULL,
    PRIMARY KEY (id_escola, id_tipo_ensino),
    CONSTRAINT fk_ete_escola FOREIGN KEY (id_escola) REFERENCES escolas(id) ON DELETE CASCADE,
    CONSTRAINT fk_ete_tipo FOREIGN KEY (id_tipo_ensino) REFERENCES tipos_ensino(id_tipo_ensino)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ========================
-- RELACIONAMENTO ESCOLA ↔ TURNOS
-- ========================
DROP TABLE IF EXISTS escola_turnos;
CREATE TABLE escola_turnos (
    id_escola INT NOT NULL,
    id_turno INT NOT NULL,
    PRIMARY KEY (id_escola, id_turno),
    CONSTRAINT fk_et_escola FOREIGN KEY (id_escola) REFERENCES escolas(id) ON DELETE CASCADE,
    CONSTRAINT fk_et_turno FOREIGN KEY (id_turno) REFERENCES turnos(id_turno)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ========================
-- POPULAR DADOS PADRÃO
-- ========================
-- Tipos de ensino
INSERT IGNORE INTO tipos_ensino (nome_tipo_ensino) VALUES
('Educação Infantil'),
('Ensino Fundamental'),
('Ensino Médio'),
('Educação Integrada'),
('Cursos Técnicos'),
('Cursos Extracurriculares'),
('Cursos de Idioma');

-- Turnos
INSERT IGNORE INTO turnos (nome_turno) VALUES
('Manhã'),
('Tarde'),
('Integral'),
('Noite'),
('Sábado');

-- Redes
INSERT IGNORE INTO redes (nome_rede) VALUES
('Municipal'),
('Estadual'),
('Fundação'),
('Particular');
