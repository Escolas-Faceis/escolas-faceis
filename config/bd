CREATE DATABASE IF NOT EXISTS escolas_faceis;
USE escolas_faceis;

-- Tabela de Usuários (comum a todos os tipos)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    imagem VARCHAR(255),
    tipo_usuario ENUM('adm', 'comum', 'escola') NOT NULL,
    contato VARCHAR(20) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_usuario INT DEFAULT 1 CHECK (status_usuario IN (0, 1)), -- 0: Inativo, 1: Ativo
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela específica para Escolas (herda de usuarios)
CREATE TABLE escolas (
    id INT PRIMARY KEY,
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    logradouro VARCHAR(255) NOT NULL,
    tipo_ensino SET('maternal', 'fundamental', 'médio', 'técnico integrado', 'cursos extracurriculares') NOT NULL,
    rede ENUM('pública', 'privada') NOT NULL,
    descricao TEXT,
    nota decimal(1,1) DEFAULT 0.00,
    valor_mensalidade DECIMAL(10,2),
    acessibilidade BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela para armazenar múltiplas imagens das escolas
CREATE TABLE escola_imagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    escola_id INT NOT NULL,
    caminho_imagem VARCHAR(255) NOT NULL,
    FOREIGN KEY (escola_id) REFERENCES escolas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela de avaliações (para usuários comuns avaliarem escolas)
CREATE TABLE avaliacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    escola_id INT NOT NULL,
    nota INT NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT,
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (escola_id) REFERENCES escolas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela de favoritos (para usuários comuns favoritarem escolas)
CREATE TABLE favoritos (
    usuario_id INT NOT NULL,
    escola_id INT NOT NULL,
    data_favoritacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, escola_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (escola_id) REFERENCES escolas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Índices para melhorar performance
CREATE INDEX idx_escola_tipo_ensino ON escolas(tipo_ensino);
CREATE INDEX idx_escola_rede ON escolas(rede);
CREATE INDEX idx_escola_valor ON escolas(valor_mensalidade);
CREATE INDEX idx_escola_nota ON escolas(nota);
